# Schemas Pydantic: definem o formato exato das respostas da API. O frontend espelha
# estes mesmos campos em frontend/src/types.ts.
from datetime import datetime

from pydantic import BaseModel


class Capital(BaseModel):
    """Uma capital brasileira, com a posicao geografica e a UF usadas pelo dropdown de selecao."""

    nm_cidade: str
    uf: str
    id_cidade: int
    latitude: float
    longitude: float


class WeatherCurrent(BaseModel):
    """Ultima leitura meteorologica conhecida de uma cidade."""

    nm_cidade: str
    data: datetime
    temperatura: float
    umidade: int
    pressao: int
    velocidade_vento: float
    visibilidade: int | None = None


class WeatherHistoryPoint(BaseModel):
    """Um ponto da serie temporal usada nos graficos de historico (2D, animados)."""

    data: datetime
    temperatura: float
    umidade: int
    velocidade_vento: float
    pressao: int


class WeatherAggregatedPoint(BaseModel):
    """Um ponto agregado (media do periodo) usado nos graficos diario/semanal/mensal."""

    periodo: datetime
    temperatura_media: float
    temperatura_min: float
    temperatura_max: float
    umidade_media: float
    pressao_media: float
    velocidade_vento_media: float
    visibilidade_media: float | None = None
