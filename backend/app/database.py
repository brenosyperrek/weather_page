# Camada de acesso ao banco: cria a engine SQLAlchemy e a sessao usada pelas rotas.
# Esta aplicacao e somente-leitura: nunca criamos schema/tabela aqui, pois ambos ja
# existem e sao mantidos pelo pipeline_dados (Airflow + dbt).
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings

# Monta a connection string no formato esperado pelo driver psycopg2.
DATABASE_URL = (
    f"postgresql+psycopg2://{settings.db_user}:{settings.db_password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
)

# pool_pre_ping evita erros quando uma conexao do pool fica obsoleta (ex: o Postgres
# reiniciou ou ficou ocioso por muito tempo).
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db() -> Generator[Session, None, None]:
    """Dependency do FastAPI: abre uma sessao por requisicao e garante que ela seja fechada."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
