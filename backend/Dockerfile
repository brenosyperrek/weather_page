# Imagem base oficial do uv ja com Python 3.12, evitando instalar o uv via pip.
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Copia primeiro so os arquivos de dependencia para aproveitar o cache de camadas do
# Docker: se o codigo da app mudar mas as dependencias nao, esta camada nao e refeita.
COPY pyproject.toml uv.lock README.md ./
RUN uv sync --frozen --no-dev

# Agora copia o codigo da aplicacao.
COPY app ./app

# Garante que os binarios instalados pelo uv (uvicorn etc.) estejam no PATH.
ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000

# --host 0.0.0.0 e essencial: sem isso o uvicorn so escuta em localhost dentro do
# container e o Nginx do frontend nao conseguiria alcanca-lo.
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
