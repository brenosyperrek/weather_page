# Clima das Capitais — weather_page

Site para visualizar dados meteorológicos das 27 capitais brasileiras, com visual
escuro inspirado nas páginas de produto da Apple, gráficos animados (incluindo
gráficos 3D) e um globo 3D interativo para selecionar a cidade.

Os dados são lidos (somente leitura) da tabela `silver.capitais_weather` em um
Postgres já populado pelo projeto irmão [`pipeline_dados`](../pipeline_dados), que
coleta dados via OpenWeatherMap 3x/dia para as 27 capitais.

## Stack

- **Backend**: Python 3.12, FastAPI, SQLAlchemy, gerenciado com [`uv`](https://docs.astral.sh/uv/).
- **Frontend**: React 18 + TypeScript + Vite, Tailwind CSS, Framer Motion, ECharts/echarts-gl
  (gráficos 2D e 3D animados) e react-three-fiber/drei (globo 3D).
- **Banco de dados**: Postgres (externo a este projeto, mantido pelo `pipeline_dados`).
- **Containers**: Docker, com Nginx servindo o build do frontend e fazendo proxy de `/api` para o backend.

## Pré-requisitos

- Python 3.12+ e [`uv`](https://docs.astral.sh/uv/) (para rodar o backend localmente).
- Node.js 20+ (para rodar o frontend localmente).
- Docker e Docker Compose (para rodar tudo containerizado).
- O Postgres do `pipeline_dados` rodando, com a tabela `silver.capitais_weather` populada.
- Para subir via Docker Compose: a rede `pipeline_dados_net` já deve existir (criada pelo
  projeto `pipeline_dados`) e o container `postgres18` deve estar conectado a ela.

## Rodando localmente (sem Docker)

**Backend** (em um terminal, dentro de `backend/`):

```bash
uv sync
WEATHER_DB_HOST=localhost uv run uvicorn app.main:app --reload --port 8000
```

**Frontend** (em outro terminal, dentro de `frontend/`):

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. O Vite faz proxy de `/api` para `http://localhost:8000`
automaticamente (ver `vite.config.ts`).

## Rodando com Docker Compose

```bash
cp .env.example .env   # ajuste as credenciais reais do Postgres, se necessário
docker compose up -d --build
```

Abra `http://localhost`. O backend também fica exposto em `http://localhost:8000`
para depuração.

## Contrato da API

| Rota | Descrição |
|---|---|
| `GET /api/capitais` | Lista as capitais com posição geográfica mais recente conhecida |
| `GET /api/weather/current/{nm_cidade}` | Última leitura meteorológica da cidade |
| `GET /api/weather/history/{nm_cidade}?limit=50` | Série temporal da cidade, mais antigo → mais recente |
| `GET /api/weather/aggregated/{nm_cidade}?granularidade=dia\|semana\|mes&limit=30` | Histórico agregado (média; min/máx para temperatura) por dia/semana/mês |
| `GET /api/weather/comparativo` | Última leitura de todas as capitais, para o gráfico 3D |
| `GET /health` | Healthcheck |

Documentação interativa (Swagger) disponível em `http://localhost:8000/docs`.
