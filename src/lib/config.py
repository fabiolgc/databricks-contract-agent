import os
import yaml
from dataclasses import dataclass

@dataclass
class DemoConfig:
    catalog: str
    schema: str
    volume: str
    source_table: str
    vector_search_endpoint: str
    vector_search_index: str
    chat_model_endpoint: str
    embedding_model_endpoint: str

def load_config(path: str) -> DemoConfig:
    with open(path, "r", encoding="utf-8") as f:
        raw = yaml.safe_load(f)

    # simple templating {{catalog}} / {{schema}}
    def render(v: str) -> str:
        if not isinstance(v, str):
            return v
        v = v.replace("{{catalog}}", raw["catalog"]).replace("{{schema}}", raw["schema"])
        return v

    cfg = {k: render(v) for k, v in raw.items()}
    return DemoConfig(**cfg)

def volume_dbfs_path(cfg: DemoConfig) -> str:
    return f"dbfs:/Volumes/{cfg.catalog}/{cfg.schema}/{cfg.volume}"

def volume_local_path(cfg: DemoConfig) -> str:
    # /dbfs is mounted local view of dbfs:
    return f"/dbfs/Volumes/{cfg.catalog}/{cfg.schema}/{cfg.volume}"
