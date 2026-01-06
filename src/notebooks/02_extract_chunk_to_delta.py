# Databricks notebook source
# MAGIC %md
# MAGIC # 02 - Extrair texto dos PDFs e gerar chunks (Delta)
# MAGIC
# MAGIC Saída: tabela Delta `contracts_chunks` com colunas:
# MAGIC - `doc_id`, `source_path`, `doc_name`, `page`, `chunk_id`, `content`, `lang`

# COMMAND ----------

# MAGIC %pip install -q pypdf pyyaml

# COMMAND ----------

import os, re, uuid
from pypdf import PdfReader
from src.lib.config import load_config, volume_local_path, volume_dbfs_path

# COMMAND ----------

REPO_ROOT = os.getcwd()
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

vol_local = volume_local_path(cfg)
vol_dbfs = volume_dbfs_path(cfg)

print("Lendo PDFs do volume:", vol_local)

# COMMAND ----------

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

# Cria catálogo/schema, se necessário
spark.sql(f"CREATE CATALOG IF NOT EXISTS {cfg.catalog}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {cfg.catalog}.{cfg.schema}")

# Salva a tabela Delta
(df.write
  .mode("overwrite")
  .option("overwriteSchema", "true")
  .saveAsTable(f"{cfg.catalog}.{cfg.schema}.contracts_chunks"))

print("Tabela criada:", f"{cfg.catalog}.{cfg.schema}.contracts_chunks", "rows:", df.count())
