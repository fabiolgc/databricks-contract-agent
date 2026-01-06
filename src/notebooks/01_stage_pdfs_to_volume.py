# Databricks notebook source
# MAGIC %md
# MAGIC # 01 - Copiar PDFs do repositório para o Volume (PT-BR)
# MAGIC
# MAGIC - Origem: `assets/pdfs/pt-br/`
# MAGIC - Destino: `dbfs:/Volumes/<catalog>/<schema>/<volume>/`
# MAGIC
# MAGIC > Se você preferir, pode ignorar este notebook e apenas fazer upload via UI do Volume.

# COMMAND ----------

import os
from src.lib.config import load_config, volume_dbfs_path

# COMMAND ----------

REPO_ROOT = os.getcwd()
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

src_dir = os.path.join(REPO_ROOT, "assets", "pdfs", "pt-br")
dst_dir = volume_dbfs_path(cfg)

print("Origem:", src_dir)
print("Destino:", dst_dir)

# COMMAND ----------

# Garante que o destino existe
dbutils.fs.mkdirs(dst_dir)

# Copia PDFs
files = [f for f in os.listdir(src_dir) if f.lower().endswith(".pdf")]
print("Arquivos:", len(files))

for f in files:
    src = f"file:{os.path.join(src_dir, f)}"
    dst = f"{dst_dir}/{f}"
    dbutils.fs.cp(src, dst, recurse=False)

print("OK. Exemplos no volume:")
display(dbutils.fs.ls(dst_dir)[:5])
