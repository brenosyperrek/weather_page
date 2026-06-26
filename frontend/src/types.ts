// Tipos TypeScript que espelham, campo a campo, os schemas Pydantic do backend
// (backend/app/schemas.py). Mante-los sincronizados evita bugs de "campo errado"
// silenciosos, ja que o TypeScript reclama em tempo de compilacao.

/** Uma capital brasileira: nome, UF e posicao geografica (usada no globo 3D). */
export interface Capital {
  nm_cidade: string
  uf: string
  id_cidade: number
  latitude: number
  longitude: number
}

/** Ultima leitura meteorologica conhecida de uma cidade. */
export interface WeatherCurrent {
  nm_cidade: string
  data: string // ISO 8601, convertido para Date quando necessario exibir formatado
  temperatura: number
  umidade: number
  pressao: number
  velocidade_vento: number
  visibilidade: number | null
}

/** Um ponto da serie temporal usada nos graficos de historico. */
export interface WeatherHistoryPoint {
  data: string
  temperatura: number
  umidade: number
  velocidade_vento: number
  pressao: number
}

/** Populacao residente, area territorial e densidade demografica de uma capital. */
export interface Populacao {
  nm_cidade: string
  uf: string
  populacao: number
  area_km2: number
  densidade_demografica: number
}

/** Granularidade de agregacao temporal usada nos graficos de evolucao por periodo. */
export type Granularidade = 'dia' | 'semana' | 'mes'

/** Um ponto agregado (media do periodo; min/max para temperatura). */
export interface WeatherAggregatedPoint {
  periodo: string
  temperatura_media: number
  temperatura_min: number
  temperatura_max: number
  umidade_media: number
  pressao_media: number
  velocidade_vento_media: number
  visibilidade_media: number | null
}
