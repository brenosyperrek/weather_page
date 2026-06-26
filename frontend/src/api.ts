// Cliente HTTP tipado para a API do backend. Usa caminhos relativos ("/api/...") porque
// tanto o proxy do Vite (dev) quanto o Nginx (producao) encaminham essas chamadas para
// o backend FastAPI -- o frontend nunca precisa saber o host/porta real da API.
import type {
  Capital,
  Granularidade,
  Populacao,
  WeatherAggregatedPoint,
  WeatherCurrent,
  WeatherHistoryPoint,
} from './types'

/** Faz o fetch e lanca um erro descritivo se a resposta nao for 2xx. */
async function buscarJson<T>(caminho: string): Promise<T> {
  const resposta = await fetch(caminho)
  if (!resposta.ok) {
    throw new Error(`Falha ao buscar ${caminho}: HTTP ${resposta.status}`)
  }
  return resposta.json() as Promise<T>
}

export function getCapitais(): Promise<Capital[]> {
  return buscarJson<Capital[]>('/api/capitais')
}

export function getPopulacao(): Promise<Populacao[]> {
  return buscarJson<Populacao[]>('/api/populacao')
}

export function getWeatherCurrent(nmCidade: string): Promise<WeatherCurrent> {
  return buscarJson<WeatherCurrent>(`/api/weather/current/${encodeURIComponent(nmCidade)}`)
}

export function getWeatherHistory(nmCidade: string, limit = 50): Promise<WeatherHistoryPoint[]> {
  return buscarJson<WeatherHistoryPoint[]>(
    `/api/weather/history/${encodeURIComponent(nmCidade)}?limit=${limit}`,
  )
}

export function getWeatherAggregated(
  nmCidade: string,
  granularidade: Granularidade,
  limit: number,
): Promise<WeatherAggregatedPoint[]> {
  return buscarJson<WeatherAggregatedPoint[]>(
    `/api/weather/aggregated/${encodeURIComponent(nmCidade)}?granularidade=${granularidade}&limit=${limit}`,
  )
}
