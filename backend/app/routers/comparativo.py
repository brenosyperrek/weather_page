# Rota que retorna a leitura mais recente de cada uma das 27 capitais ao mesmo tempo --
# usada pelo grafico de barras 3D (echarts-gl) que compara todas as cidades de uma vez.
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.capitais import CIDADE_PARA_UF
from app.database import get_db
from app.models import capitais_weather
from app.schemas import ComparativoItem

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/comparativo", response_model=list[ComparativoItem])
def obter_comparativo(db: Session = Depends(get_db)) -> list[ComparativoItem]:
    """DISTINCT ON (nm_cidade) ordenado por data DESC: uma linha por cidade, sempre a
    leitura mais recente disponivel para ela.
    """
    consulta = (
        select(
            capitais_weather.c.nm_cidade,
            capitais_weather.c.temperatura,
            capitais_weather.c.umidade,
            capitais_weather.c.data,
        )
        .distinct(capitais_weather.c.nm_cidade)
        .order_by(capitais_weather.c.nm_cidade, capitais_weather.c.data.desc())
    )

    linhas = db.execute(consulta).all()

    return [
        ComparativoItem(
            nm_cidade=linha.nm_cidade,
            uf=CIDADE_PARA_UF.get(linha.nm_cidade, "??"),
            temperatura=linha.temperatura,
            umidade=linha.umidade,
            data=linha.data,
        )
        for linha in linhas
    ]
