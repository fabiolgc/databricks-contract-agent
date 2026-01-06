# Databricks notebook source
# MAGIC %md
# MAGIC # 03 - Criar Vector Search endpoint + index (Delta Sync)
# MAGIC
# MAGIC - Endpoint: `cfg.vector_search_endpoint`
# MAGIC - Index: `cfg.vector_search_index`
# MAGIC - Fonte: `cfg.source_table`
# MAGIC
# MAGIC Docs: Vector Search pode ser criado por UI, SDK ou REST.

# COMMAND ----------

# MAGIC %pip install -q databricks-vectorsearch pyyaml

# COMMAND ----------

from databricks.vector_search.client import VectorSearchClient
from src.lib.config import load_config
import os, time

# COMMAND ----------

REPO_ROOT = os.getcwd()
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

vsc = VectorSearchClient()

endpoint_name = cfg.vector_search_endpoint
index_name = cfg.vector_search_index

print("Endpoint:", endpoint_name)
print("Index:", index_name)
print("Source table:", cfg.source_table)

# COMMAND ----------

# 1) Criar endpoint se não existir
try:
    vsc.get_endpoint(endpoint_name)
    print("Endpoint já existe.")
except Exception:
    print("Criando endpoint...")
    vsc.create_endpoint(name=endpoint_name, endpoint_type="STANDARD")

# 2) Criar index (Delta Sync) se não existir
try:
    vsc.get_index(endpoint_name=endpoint_name, index_name=index_name)
    print("Index já existe.")
except Exception:
    print("Criando index (delta sync)...")
    vsc.create_delta_sync_index(
        endpoint_name=endpoint_name,
        index_name=index_name,
        source_table_name=cfg.source_table,
        pipeline_type="TRIGGERED",
        primary_key="doc_id",
        embedding_source_column="content",
        columns_to_sync=["source_path", "doc_name", "page", "chunk_id", "content", "lang"],
        # Se você tiver um endpoint de embeddings dedicado, pode configurar:
        # model_endpoint_name_for_query=cfg.embedding_model_endpoint
    )

print("OK. Você pode testar queries no notebook 04.")
