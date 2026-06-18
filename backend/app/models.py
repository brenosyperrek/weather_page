# Mapeamento da tabela silver.capitais_weather usando SQLAlchemy Core (Table), em vez do
# ORM declarativo, porque so fazemos SELECTs nesta tabela -- ela e populada por fora
# (pipeline_dados) e esta aplicacao nunca deve rodar DDL ou INSERT/UPDATE sobre ela.
from sqlalchemy import BIGINT, DOUBLE_PRECISION, TEXT, TIMESTAMP, Column, MetaData, Table

from app.config import settings

metadata = MetaData(schema=settings.db_schema)

# Colunas e tipos espelham exatamente o que o modelo dbt
# (dbt_pipeline_dados/models/silver/capitais_weather.sql) gera no Postgres.
capitais_weather = Table(
    settings.db_table,
    metadata,
    Column("tipo_coleta", TEXT),  # tipo de coleta da OpenWeatherMap (ex: "stations")
    Column("visibilidade", BIGINT),  # visibilidade em metros
    Column("data", TIMESTAMP(timezone=True)),  # data/hora UTC da coleta
    Column("fuso_horario", BIGINT),  # offset do fuso horario em segundos
    Column("id_cidade", BIGINT),  # id da cidade na OpenWeatherMap
    Column("nm_cidade", TEXT),  # nome da cidade, ex: "Florianopolis"
    Column("latitude", DOUBLE_PRECISION),
    Column("longitude", DOUBLE_PRECISION),
    Column("temperatura", DOUBLE_PRECISION),  # graus Celsius
    Column("pressao", BIGINT),  # hPa
    Column("umidade", BIGINT),  # % relativa
    Column("velocidade_vento", DOUBLE_PRECISION),  # m/s
)
