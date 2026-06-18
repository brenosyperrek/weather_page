# Mapeamento de cidade -> UF para as 27 capitais brasileiras. A tabela silver.capitais_weather
# nao guarda a UF (so o nome da cidade), entao usamos esta mesma lista que o pipeline_dados
# usa para coletar os dados (src/weather_data/capitais_brasil.py), so que invertida
# (nome da cidade -> sigla do estado) para ser facil de consultar a partir do nm_cidade.
CIDADE_PARA_UF: dict[str, str] = {
    "Rio Branco": "AC",
    "Maceió": "AL",
    "Macapá": "AP",
    "Manaus": "AM",
    "Salvador": "BA",
    "Fortaleza": "CE",
    "Brasília": "DF",
    "Vitória": "ES",
    "Goiânia": "GO",
    "São Luís": "MA",
    "Cuiabá": "MT",
    "Campo Grande": "MS",
    "Belo Horizonte": "MG",
    "Belém": "PA",
    "João Pessoa": "PB",
    "Curitiba": "PR",
    "Recife": "PE",
    "Teresina": "PI",
    "Rio de Janeiro": "RJ",
    "Natal": "RN",
    "Porto Alegre": "RS",
    "Porto Velho": "RO",
    "Boa Vista": "RR",
    "Florianópolis": "SC",
    "São Paulo": "SP",
    "Aracaju": "SE",
    "Palmas": "TO",
}
