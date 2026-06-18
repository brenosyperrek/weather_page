# Configuracoes da aplicacao, lidas de variaveis de ambiente (ou de um arquivo .env em dev local).
# Usamos pydantic-settings para validar os tipos automaticamente e ter um unico ponto de verdade
# para tudo que e configuravel (host do banco, credenciais, origens permitidas no CORS).
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Dados de conexao com o Postgres que ja contem a tabela silver.capitais_weather.
    # Em desenvolvimento local (fora do Docker) o host costuma ser "localhost".
    # Dentro do docker-compose, o backend se junta a rede "pipeline_dados_net" e usa
    # o nome do container do Postgres ("postgres18") como host.
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_name: str = "postgres"

    # Schema/tabela onde os dados meteorologicos ja sao gravados pelo pipeline_dados.
    db_schema: str = "silver"
    db_table: str = "capitais_weather"

    # Origens do frontend autorizadas a chamar esta API (CORS). Em dev local o Vite roda
    # em http://localhost:5173; em producao (container) o Nginx do frontend roda em
    # http://localhost (porta 80), por isso ambas entram no default.
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost"]

    # Prefixo usado para nomear as variaveis de ambiente, ex: WEATHER_DB_HOST.
    model_config = SettingsConfigDict(env_prefix="weather_", env_file=".env", extra="ignore")


# Instancia unica e compartilhada das configuracoes, importada pelos outros modulos.
settings = Settings()
