# Ponto de entrada da API: cria a aplicacao FastAPI, libera CORS para o frontend e
# registra as rotas de cada modulo (capitais, weather, comparativo).
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import capitais, weather

app = FastAPI(
    title="Weather Page API",
    description="API somente-leitura sobre silver.capitais_weather, usada pelo frontend do weather_page.",
    version="0.1.0",
)

# Sem isso, o navegador bloquearia as chamadas feitas pelo frontend (rodando em uma
# origem/porta diferente da API) por causa da politica de mesma origem.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
)

app.include_router(capitais.router)
app.include_router(weather.router)


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Usado pelo healthcheck do Docker para saber se a API esta de pe."""
    return {"status": "ok"}
