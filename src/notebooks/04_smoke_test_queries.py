# Databricks notebook source
# MAGIC %md
# MAGIC # 04 - Smoke test (demo questions)
# MAGIC
# MAGIC Runs some queries on Vector Search and prints the excerpts with (doc, page).

# COMMAND ----------

#%pip install -q databricks-vectorsearch pyyaml
#%restart_python

# COMMAND ----------

from databricks.vector_search.client import VectorSearchClient
from src.lib.config import load_config
import os

vsc = VectorSearchClient(disable_notice=True) # Ensure the notice is disabled

# COMMAND ----------

NOTEBOOK_DIR = os.getcwd()
NOTRBOOK_PARENT = os.path.dirname(NOTEBOOK_DIR)
REPO_ROOT = os.path.dirname(NOTRBOOK_PARENT)
CONFIG_PATH = os.path.join(REPO_ROOT, "conf", "demo_config.yml")
cfg = load_config(CONFIG_PATH)

idx = vsc.get_index(endpoint_name=cfg.vector_search_endpoint, index_name=cfg.vector_search_index)


# COMMAND ----------

queries = [
  "Onde fala sobre multa por rescisão antecipada?",
  "Qual o aviso prévio para cancelar?",
  "Quais são os prazos de liquidação para débito e crédito à vista?",
  "Qual a garantia do equipamento e o que não cobre?",
  "Por quanto tempo vale o desconto aplicado e quando ele pode ser removido?"
]

# COMMAND ----------

arr = ""
r = ""

for q in queries:
    print("\n" + "="*100)
    print("Q:", q)
    r = idx.similarity_search(query_text=q, columns=["content", "doc_name", "page"], num_results=4,disable_notice=True)
    # r é dict; resultados em r['result']['data_array']
    arr = r["result"]["data_array"]
    for i, row in enumerate(arr, start=1):
        content, doc_name, page = row[0], row[1], row[2]
        print(f"\n--- Match {i} | {doc_name} | pág {page} ---")
        print(content[:650] + ("..." if len(content)>650 else ""))