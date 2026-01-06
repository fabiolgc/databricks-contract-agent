# Databricks notebook source
# MAGIC %md
# MAGIC # 02 - Extract text from PDFs and generate chunks (Delta)
# MAGIC
# MAGIC Output: Delta table `contracts_chunks` with columns:
# MAGIC - `doc_id`, `source_path`, `doc_name`, `page`, `chunk_id`, `content`, `lang`

# COMMAND ----------

# MAGIC %pip install -q pypdf pyyaml
# MAGIC %restart_python

# COMMAND ----------

import os, re, uuid
from pypdf import PdfReader
from src.lib.config import load_config, volume_local_path, volume_dbfs_path

# COMMAND ----------

NOTEBOOK_DIR = os.getcwd()
NOTRBOOK_PARENT = os.path.dirname(NOTEBOOK_DIR)
REPO_ROOT = os.path.dirname(NOTRBOOK_PARENT)
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

vol_local = volume_local_path(cfg)
vol_dbfs = volume_dbfs_path(cfg)

pdf_files = [f for f in os.listdir(vol_local) if f.lower().endswith(".pdf")]
print("Read PDF files from volume:", vol_local)
print("PDF files found:", len(pdf_files))

# COMMAND ----------

#extract chuncks from pdf files

def chunk_text(text: str, max_chars: int = 900, overlap: int = 120):
    text = re.sub(r"\s+", " ", (text or "")).strip()
    if not text:
        return []
    chunks = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        chunks.append(text[start:end])
        if end == len(text):
            break
        start = max(0, end - overlap)
    return chunks

rows = []
for f in os.listdir(vol_local):
    if not f.lower().endswith(".pdf"):
        continue
    local_path = os.path.join(vol_local, f)
    reader = PdfReader(local_path)
    doc_id = str(uuid.uuid4())
    for page_idx, page in enumerate(reader.pages):
        page_text = (page.extract_text() or "").strip()
        for i, ch in enumerate(chunk_text(page_text)):
            rows.append({
                "doc_id": doc_id,
                "source_path": f"{vol_dbfs}/{f}",
                "doc_name": f,
                "page": page_idx + 1,
                "chunk_id": i,
                "content": ch,
                "lang": "pt-BR"
            })

df = spark.createDataFrame(rows)
display(df.limit(5))

# COMMAND ----------

# create catalog/schema if needed
spark.sql(f"CREATE CATALOG IF NOT EXISTS {cfg.catalog}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {cfg.catalog}.{cfg.schema}")

# save delta table with change data feed enabled
(df.write
  .mode("overwrite")
  .option("overwriteSchema", "true")
  .option("delta.enableChangeDataFeed", "true")
  .saveAsTable(f"{cfg.catalog}.{cfg.schema}.contracts_chunks"))

print("Created table:", f"{cfg.catalog}.{cfg.schema}.contracts_chunks", "rows:", df.count())

# COMMAND ----------

#spark.sql(f"ALTER TABLE {cfg.catalog}.{cfg.schema}.contracts_chunks SET TBLPROPERTIES (delta.enableChangeDataFeed = true)")

# COMMAND ----------

# display data for validation
df = spark.read.table(f"{cfg.catalog}.{cfg.schema}.contracts_chunks")
display(df.limit(50))