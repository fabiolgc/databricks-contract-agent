# Databricks notebook source
# MAGIC %md
# MAGIC # 03 - Create Vector Search endpoint + index (Delta Sync)
# MAGIC
# MAGIC - Endpoint: `cfg.vector_search_endpoint`
# MAGIC - Index: `cfg.vector_search_index`
# MAGIC - Source: `cfg.source_table`
# MAGIC
# MAGIC Docs: Vector Search can be created via UI, SDK, or REST.

# COMMAND ----------

#%pip install -q databricks-vectorsearch pyyaml
#%restart_python

# COMMAND ----------

from databricks.vector_search.client import VectorSearchClient
from src.lib.config import load_config
import os, time

# COMMAND ----------

NOTEBOOK_DIR = os.getcwd()
NOTRBOOK_PARENT = os.path.dirname(NOTEBOOK_DIR)
REPO_ROOT = os.path.dirname(NOTRBOOK_PARENT)
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

vsc = VectorSearchClient()

endpoint_name = cfg.vector_search_endpoint
index_name = cfg.vector_search_index

print("Endpoint:", endpoint_name)
print("Index:", index_name)
print("Source table:", cfg.source_table)

# COMMAND ----------

# 1) Create endpoint if not exists
def wait_for_endpoint_ready(vsc, endpoint_name, timeout=300, interval=10):
    start = time.time()
    while True:
        endpoint = vsc.get_endpoint(endpoint_name)
        state = endpoint.get("state", {}).get("ready", "")
        update_state = endpoint.get("state", {}).get("update_state", "")
        if state == "READY":
            print(f"Endpoint '{endpoint_name}' is READY.")
            break
        if update_state == "UPDATING":
            print(f"Endpoint '{endpoint_name}' is being created (UPDATING).")
        if time.time() - start > timeout:
            print(f"Notebook timeout: Endpoint '{endpoint_name}' was not ready within 5 minutes.")
            break
        print(f"Waiting for endpoint '{endpoint_name}' to be READY. Current state: {state}, update_state: {update_state}")
        time.sleep(interval)

try:
    endpoint = vsc.get_endpoint(endpoint_name)
    state = endpoint.get("state", {}).get("ready", "")
    update_state = endpoint.get("state", {}).get("update_state", "")
    if state == "READY":
        print("Endpoint already created and READY.")
    elif update_state == "UPDATING":
        print("Endpoint is currently being created (UPDATING).")
        wait_for_endpoint_ready(vsc, endpoint_name)
    else:
        print(f"Endpoint exists but not READY. State: {state}, update_state: {update_state}")
        wait_for_endpoint_ready(vsc, endpoint_name)
except Exception:
    print("Creating endpoint...")
    vsc.create_endpoint(name=endpoint_name, endpoint_type="STANDARD")
    wait_for_endpoint_ready(vsc, endpoint_name)

# 2) Create index (Delta Sync) if not exists
def wait_for_index_ready(vsc, endpoint_name, index_name, timeout=300, interval=10):
    start = time.time()
    while True:
        index = vsc.get_index(endpoint_name=endpoint_name, index_name=index_name)
        state = index.get("status", {}).get("ready", "")
        if state == "READY":
            print(f"Index '{index_name}' is READY.")
            break
        if time.time() - start > timeout:
            print(f"Notebook timeout: Index '{index_name}' was not ready within 5 minutes.")
            break
        print(f"Waiting for index '{index_name}' to be READY. Current state: {state}")
        time.sleep(interval)

try:
    vsc.get_index(endpoint_name=endpoint_name, index_name=index_name)
    print("Index already created.")
except Exception:
    print("Creating index (delta sync)...")
    vsc.create_delta_sync_index(
        endpoint_name=endpoint_name,
        index_name=index_name,
        source_table_name=cfg.source_table,
        pipeline_type="TRIGGERED",
        primary_key="doc_id",
        embedding_source_column="content",
        embedding_model_endpoint_name=cfg.embedding_model_endpoint,
        columns_to_sync=["source_path", "doc_name", "page", "chunk_id", "content", "lang"],
    )
    wait_for_index_ready(vsc, endpoint_name, index_name)

print("OK. Now you can test queries in notebook 4.")