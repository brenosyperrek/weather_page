# Rotas com os dados meteorologicos de uma cidade especifica: leitura atual e historico
# (usado pelo grafico de linha 2D animado).
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import capitais_weather
from app.schemas import WeatherCurrent, WeatherHistoryPoint

router = APIRouter(prefix="/api/weather", tags=["weather"])


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
