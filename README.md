# Databricks Contract Agent Demo

Demo para **pesquisa semântica em contratos/manuais (PT-BR)** usando:
- Unity Catalog Volumes (armazenamento de PDFs)
- Delta (chunks)
- Mosaic AI Vector Search (índice)
- (Opcional) Databricks App (Node.js) para mock de API externa

## Estrutura
- `assets/pdfs/pt-br/` → PDFs fictícios para demo
- `conf/demo_config.yml` → catálogo, schema, volume, endpoints
- `src/notebooks/` → notebooks para ingestão e indexação
- `resources/jobs.yml` → job do Asset Bundle
- `apps/node-express/` → UI + mock API (opcional)

## Rodando via Asset Bundle (DAB)
1. Instale/atualize Databricks CLI e configure o perfil (AWS).
2. Defina um cluster all-purpose e pegue o `cluster_id`.
3. Valide e faça deploy:

```bash
databricks bundle validate
databricks bundle deploy --var cluster_id=<SEU_CLUSTER_ID>
databricks bundle run cielo_contract_agent_demo_job --var cluster_id=<SEU_CLUSTER_ID>
```

> Dica: você também pode rodar os notebooks manualmente pelo Workspace.

## Notebooks
Execute em ordem:
1. `00_setup_config.py`
2. `01_stage_pdfs_to_volume.py`
3. `02_extract_chunk_to_delta.py`
4. `03_create_vector_search_index.py`
5. `04_smoke_test_queries.py`
# databricks-contract-agent
