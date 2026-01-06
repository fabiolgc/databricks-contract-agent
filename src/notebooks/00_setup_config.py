# Databricks notebook source
# MAGIC %md
# MAGIC # 00 - Setup (config + paths)
# MAGIC
# MAGIC Este notebook carrega o arquivo `conf/demo_config.yml` e mostra os caminhos usados na demo.

# COMMAND ----------

#%pip install pyyaml
#%restart_python

# COMMAND ----------

import os
from src.lib.config import load_config, volume_dbfs_path, volume_local_path

# COMMAND ----------


NOTEBOOK_DIR = os.getcwd()
NOTRBOOK_PARENT = os.path.dirname(NOTEBOOK_DIR)
REPO_ROOT = os.path.dirname(NOTRBOOK_PARENT)

print(REPO_ROOT)
CONFIG_PATH = os.path.join(
    REPO_ROOT,
    "conf",
    "demo_config.yml"
)

if not os.path.exists(CONFIG_PATH):
    raise FileNotFoundError(
        f"Config file not found at {CONFIG_PATH}. "
        "Please check the path or upload the file."
    )

cfg = load_config(CONFIG_PATH)

print("Config carregada:")
print(cfg)
print("\nVolume (dbfs):", volume_dbfs_path(cfg))
print("Volume (local):", volume_local_path(cfg))
print("\nTabela source (chunks):", cfg.source_table)
print("Vector Search endpoint:", cfg.vector_search_endpoint)
print("Vector Search index:", cfg.vector_search_index)