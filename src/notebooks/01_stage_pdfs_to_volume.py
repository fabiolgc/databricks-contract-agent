# Databricks notebook source
# MAGIC %md
# MAGIC # 01 - Copy workspace pdf files to volume
# MAGIC
# MAGIC - Source: `assets/pdfs/pt-br/`
# MAGIC - Destination: `dbfs:/Volumes/<catalog>/<schema>/<volume>/`
# MAGIC
# MAGIC > If you prefer, you can skip this notebook and just upload via the Volume UI.
# MAGIC

# COMMAND ----------

# MAGIC %pip install pyyaml
# MAGIC %restart_python

# COMMAND ----------

import os
from src.lib.config import load_config, volume_dbfs_path, volume_local_path

# COMMAND ----------

NOTEBOOK_DIR = os.getcwd()
NOTRBOOK_PARENT = os.path.dirname(NOTEBOOK_DIR)
REPO_ROOT = os.path.dirname(NOTRBOOK_PARENT)
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

src_dir = os.path.join(REPO_ROOT, "assets", "pdfs", "pt-br")
dst_dir = volume_local_path(cfg)

print("Source:", src_dir)
print("Ending:", dst_dir)

# COMMAND ----------

# Cria catálogo e schema conforme nomes em cfg
catalog_name = cfg.catalog
schema_name = cfg.schema
volume_name = cfg.volume

spark.sql(f"CREATE CATALOG IF NOT EXISTS {catalog_name}")
spark.sql(f"CREATE SCHEMA IF NOT EXISTS {catalog_name}.{schema_name}")
spark.sql(f"CREATE VOLUME IF NOT EXISTS {catalog_name}.{schema_name}.{volume_name}")

# COMMAND ----------

import os

# List PDF files in the source directory
files = [
    f
    for f in os.listdir(src_dir)
    if f.lower().endswith(".pdf")
]

file_names = [f for f in files]

for idx, fname in enumerate(files, 1):
    src_path = os.path.join(src_dir, fname)
    dst_path = os.path.join(dst_dir, fname)
     
    print(f"{src_path} - {dst_path}")

    with open(src_path, "rb") as fsrc:
        with open(dst_path, "wb") as fdst:
            fdst.write(fsrc.read())
    print(f"{idx}: {src_path} -> {dst_path}")