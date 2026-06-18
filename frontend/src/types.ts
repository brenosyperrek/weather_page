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

/** Um ponto da serie temporal usada no grafico de historico. */
export interface WeatherHistoryPoint {
  data: string
  temperatura: number
  umidade: number
  velocidade_vento: number
}

/** Ultima leitura de uma capital, usada no grafico 3D comparativo entre todas. */
export interface ComparativoItem {
  nm_cidade: string
  uf: string
  temperatura: number
  umidade: number
  data: string
}
