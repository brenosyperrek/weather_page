# Rota com a populacao residente, area territorial e densidade demografica das 27
# capitais. Usada pelo frontend para enriquecer o mapa e alimentar os graficos
# populacionais (dados estaticos, ver app/populacao.py).
from fastapi import APIRouter

from app.capitais import CIDADE_PARA_UF
from app.populacao import POPULACAO_CAPITAIS
from app.schemas import Populacao

router = APIRouter(prefix="/api/populacao", tags=["populacao"])


@router.get("", response_model=list[Populacao])
def listar_populacao() -> list[Populacao]:
    """Retorna populacao, area e densidade demografica de cada uma das 27 capitais."""
    return [
        Populacao(
            nm_cidade=nm_cidade,
            uf=CIDADE_PARA_UF[nm_cidade],
            populacao=dados.populacao,
            area_km2=dados.area_km2,
            densidade_demografica=round(dados.populacao / dados.area_km2, 2),
        )
        for nm_cidade, dados in POPULACAO_CAPITAIS.items()
    ]
