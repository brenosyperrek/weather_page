# Rotas com os dados meteorologicos de uma cidade especifica: leitura atual, historico
# bruto (usado pelo grafico de linha 2D animado) e historico agregado por dia/semana/mes
# (usado pelos graficos de evolucao por periodo).
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import capitais_weather
from app.schemas import WeatherAggregatedPoint, WeatherCurrent, WeatherHistoryPoint

router = APIRouter(prefix="/api/weather", tags=["weather"])

# Mapeia a granularidade (recebida na URL) para a unidade aceita pelo date_trunc do
# Postgres. O tipo Literal abaixo ja garante que so esses 3 valores chegam aqui.
_TRUNC_POR_GRANULARIDADE: dict[str, str] = {"dia": "day", "semana": "week", "mes": "month"}


@router.get("/current/{nm_cidade}", response_model=WeatherCurrent)
def obter_clima_atual(nm_cidade: str, db: Session = Depends(get_db)) -> WeatherCurrent:
    """Retorna a leitura mais recente de uma cidade (404 se a cidade nunca foi coletada)."""
    consulta = (
        select(capitais_weather)
        .where(capitais_weather.c.nm_cidade == nm_cidade)
        .order_by(capitais_weather.c.data.desc())
        .limit(1)
    )
    linha = db.execute(consulta).first()

    if linha is None:
        raise HTTPException(status_code=404, detail=f"Sem dados para a cidade '{nm_cidade}'")

    return WeatherCurrent(
        nm_cidade=linha.nm_cidade,
        data=linha.data,
        temperatura=linha.temperatura,
        umidade=linha.umidade,
        pressao=linha.pressao,
        velocidade_vento=linha.velocidade_vento,
        visibilidade=linha.visibilidade,
    )


@router.get("/history/{nm_cidade}", response_model=list[WeatherHistoryPoint])
def obter_historico(
    nm_cidade: str, limit: int = 50, db: Session = Depends(get_db)
) -> list[WeatherHistoryPoint]:
    """Retorna as ultimas `limit` coletas da cidade, em ordem cronologica crescente
    (do mais antigo para o mais recente), para alimentar o grafico de linha do tempo.
    """
    # Sub-consulta: pega as `limit` coletas mais recentes (ordem decrescente).
    sub_consulta = (
        select(capitais_weather)
        .where(capitais_weather.c.nm_cidade == nm_cidade)
        .order_by(capitais_weather.c.data.desc())
        .limit(limit)
        .subquery()
    )

    # Consulta externa: reordena em ordem crescente, para o grafico desenhar da esquerda
    # (mais antigo) para a direita (mais recente).
    consulta = select(sub_consulta).order_by(sub_consulta.c.data.asc())

    linhas = db.execute(consulta).all()

    return [
        WeatherHistoryPoint(
            data=linha.data,
            temperatura=linha.temperatura,
            umidade=linha.umidade,
            velocidade_vento=linha.velocidade_vento,
            pressao=linha.pressao,
        )
        for linha in linhas
    ]


@router.get("/aggregated/{nm_cidade}", response_model=list[WeatherAggregatedPoint])
def obter_historico_agregado(
    nm_cidade: str,
    granularidade: Literal["dia", "semana", "mes"] = "dia",
    limit: int = 30,
    db: Session = Depends(get_db),
) -> list[WeatherAggregatedPoint]:
    """Retorna a media (e, para temperatura, min/max) por dia/semana/mes da cidade, em
    ordem cronologica crescente, para os graficos de evolucao por periodo.
    """
    unidade = _TRUNC_POR_GRANULARIDADE[granularidade]
    periodo = func.date_trunc(unidade, capitais_weather.c.data).label("periodo")

    # Mesma estrutura de obter_historico: agrupa/ordena decrescente com limit, depois
    # reordena ascendente na consulta externa para o grafico desenhar mais antigo -> mais recente.
    sub_consulta = (
        select(
            periodo,
            func.avg(capitais_weather.c.temperatura).label("temperatura_media"),
            func.min(capitais_weather.c.temperatura).label("temperatura_min"),
            func.max(capitais_weather.c.temperatura).label("temperatura_max"),
            func.avg(capitais_weather.c.umidade).label("umidade_media"),
            func.avg(capitais_weather.c.pressao).label("pressao_media"),
            func.avg(capitais_weather.c.velocidade_vento).label("velocidade_vento_media"),
            func.avg(capitais_weather.c.visibilidade).label("visibilidade_media"),
        )
        .where(capitais_weather.c.nm_cidade == nm_cidade)
        .group_by(periodo)
        .order_by(periodo.desc())
        .limit(limit)
        .subquery()
    )

    consulta = select(sub_consulta).order_by(sub_consulta.c.periodo.asc())
    linhas = db.execute(consulta).all()

    return [
        WeatherAggregatedPoint(
            periodo=linha.periodo,
            temperatura_media=linha.temperatura_media,
            temperatura_min=linha.temperatura_min,
            temperatura_max=linha.temperatura_max,
            umidade_media=linha.umidade_media,
            pressao_media=linha.pressao_media,
            velocidade_vento_media=linha.velocidade_vento_media,
            visibilidade_media=linha.visibilidade_media,
        )
        for linha in linhas
    ]
