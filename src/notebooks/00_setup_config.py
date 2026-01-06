# Databricks notebook source
# MAGIC %md
# MAGIC # 00 - Setup (config + paths)
# MAGIC
# MAGIC Este notebook carrega o arquivo `conf/demo_config.yml` e mostra os caminhos usados na demo.

# COMMAND ----------

import os
from src.lib.config import load_config, volume_dbfs_path, volume_local_path

# COMMAND ----------

# Ajuste se você rodar fora do repo /Workspace/Repos
REPO_ROOT = os.getcwd()
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")

cfg = load_config(CONFIG_PATH)

print("Config carregada:")
print(cfg)
print("\nVolume (dbfs):", volume_dbfs_path(cfg))
print("Volume (local):", volume_local_path(cfg))
print("\nTabela fonte (chunks):", cfg.source_table)
print("Vector Search endpoint:", cfg.vector_search_endpoint)
print("Vector Search index:", cfg.vector_search_index)

# COMMAND ----------

# MAGIC %md
# MAGIC **Próximo passo:** rode o notebook 01 para copiar PDFs do repo para o Volume (ou faça upload manual via UI).
