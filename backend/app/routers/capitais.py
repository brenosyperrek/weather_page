# Rota que lista as 27 capitais com a posicao geografica mais recente conhecida para cada
# uma. Usada pelo frontend para popular o dropdown de selecao e posicionar os marcadores
# no globo 3D.
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.capitais import CIDADE_PARA_UF
from app.database import get_db
from app.models import capitais_weather
from app.schemas import Capital

router = APIRouter(prefix="/api/capitais", tags=["capitais"])


@router.get("", response_model=list[Capital])
def listar_capitais(db: Session = Depends(get_db)) -> list[Capital]:
    """Retorna, para cada cidade que ja apareceu na tabela, a leitura mais recente
    (de onde tiramos id_cidade/latitude/longitude) combinada com a UF conhecida.
    """
    # DISTINCT ON (nm_cidade) ordenado por data DESC -> pega so a linha mais recente de
    # cada cidade, em uma unica query (sintaxe especifica do Postgres).
    consulta = (
        select(
            capitais_weather.c.nm_cidade,
            capitais_weather.c.id_cidade,
            capitais_weather.c.latitude,
            capitais_weather.c.longitude,
        )
        .distinct(capitais_weather.c.nm_cidade)
        .order_by(capitais_weather.c.nm_cidade, capitais_weather.c.data.desc())
    )

    linhas = db.execute(consulta).all()

    return [
        Capital(
            nm_cidade=linha.nm_cidade,
            uf=CIDADE_PARA_UF.get(linha.nm_cidade, "??"),
            id_cidade=linha.id_cidade,
            latitude=linha.latitude,
            longitude=linha.longitude,
        )
        for linha in linhas
    ]
