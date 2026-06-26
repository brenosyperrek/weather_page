# Populacao residente e area territorial das 27 capitais brasileiras. Diferente da tabela
# silver.capitais_weather (que e somente-leitura e populada pelo pipeline_dados), estes dados
# nao mudam com frequencia, entao ficam hardcoded aqui em vez de exigir uma tabela no banco.
#
# Fontes:
# - populacao: dados/populacao_residente.xlsx (populacao residente por municipio, linha da
#   capital de cada UF).
# - area_km2: area territorial oficial do IBGE (Estrutura Territorial) por municipio.
from typing import NamedTuple


class DadosPopulacao(NamedTuple):
    populacao: int
    area_km2: float


POPULACAO_CAPITAIS: dict[str, DadosPopulacao] = {
    "Rio Branco": DadosPopulacao(364756, 8834.942),
    "Maceió": DadosPopulacao(957916, 509.320),
    "Macapá": DadosPopulacao(442933, 6563.849),
    "Manaus": DadosPopulacao(2063689, 11401.092),
    "Salvador": DadosPopulacao(2417678, 693.453),
    "Fortaleza": DadosPopulacao(2428708, 312.353),
    "Brasília": DadosPopulacao(2817381, 5760.783),
    "Vitória": DadosPopulacao(322869, 97.123),
    "Goiânia": DadosPopulacao(1437366, 728.841),
    "São Luís": DadosPopulacao(1037775, 582.974),
    "Cuiabá": DadosPopulacao(650877, 4327.450),
    "Campo Grande": DadosPopulacao(898100, 8082.978),
    "Belo Horizonte": DadosPopulacao(2315560, 331.354),
    "Belém": DadosPopulacao(1303403, 1059.466),
    "João Pessoa": DadosPopulacao(833932, 210.044),
    "Curitiba": DadosPopulacao(1773718, 434.892),
    "Recife": DadosPopulacao(1488920, 218.843),
    "Teresina": DadosPopulacao(866300, 1391.046),
    "Rio de Janeiro": DadosPopulacao(6211223, 1200.329),
    "Natal": DadosPopulacao(751300, 167.401),
    "Porto Alegre": DadosPopulacao(1332845, 495.390),
    "Porto Velho": DadosPopulacao(460434, 34090.952),
    "Boa Vista": DadosPopulacao(413486, 5687.037),
    "Florianópolis": DadosPopulacao(537211, 674.844),
    "São Paulo": DadosPopulacao(11451999, 1521.110),
    "Aracaju": DadosPopulacao(602757, 182.163),
    "Palmas": DadosPopulacao(302692, 2227.444),
}
