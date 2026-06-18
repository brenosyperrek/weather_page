# Schemas Pydantic: definem o formato exato das respostas da API. O frontend espelha
# estes mesmos campos em frontend/src/types.ts.
from datetime import datetime

from pydantic import BaseModel


class Capital(BaseModel):
    """Uma capital brasileira, com a posicao geografica usada pelo globo 3D e a UF do dropdown."""

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
    """Um ponto da serie temporal usada no grafico de historico (2D, animado)."""

    data: datetime
    temperatura: float
    umidade: int
    velocidade_vento: float


class ComparativoItem(BaseModel):
    """Ultima leitura de uma capital, usada no grafico 3D que compara todas as 27 ao mesmo tempo."""

    nm_cidade: str
    uf: str
    temperatura: float
    umidade: int
    data: datetime
