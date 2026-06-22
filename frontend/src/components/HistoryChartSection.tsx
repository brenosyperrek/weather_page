// Quatro graficos de linha 2D animados (ECharts) com o historico recente da cidade
// selecionada: temperatura, umidade, vento e pressao -- um grafico por parametro, cada
// um com sua propria escala, para nao misturar unidades muito diferentes no mesmo eixo.
import { useEffect, useState } from 'react'
import { getWeatherHistory } from '../api'
import type { WeatherHistoryPoint } from '../types'
import ParameterLineChart from './charts/ParameterLineChart'

interface Props {
  cidadeSelecionada: string
}

interface ConfigParametro {
  titulo: string
  cor: string
  extrairValor: (ponto: WeatherHistoryPoint) => number
}

// Um parametro por grafico: titulo exibido, cor da linha (mesma paleta Gruvbox usada
// nos cards de CurrentWeatherCard, para manter a cor de cada metrica consistente em
// toda a pagina) e como extrair o valor do ponto de historico retornado pela API.
const PARAMETROS: ConfigParametro[] = [
  { titulo: 'Temperatura (°C)', cor: '#ea6962', extrairValor: (p) => p.temperatura },
  { titulo: 'Umidade (%)', cor: '#7daea3', extrairValor: (p) => p.umidade },
  { titulo: 'Vento (m/s)', cor: '#d3869b', extrairValor: (p) => p.velocidade_vento },
  { titulo: 'Pressão (hPa)', cor: '#d8a657', extrairValor: (p) => p.pressao },
]

export default function HistoryChartSection({ cidadeSelecionada }: Props) {
  const [pontos, setPontos] = useState<WeatherHistoryPoint[]>([])

  useEffect(() => {
    getWeatherHistory(cidadeSelecionada, 50).then(setPontos)
  }, [cidadeSelecionada])

  const categorias = pontos.map((ponto) =>
    new Date(ponto.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
  )

  return (
    <section id="historico" className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Histórico recente</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PARAMETROS.map((config) => (
          <ParameterLineChart
            key={config.titulo}
            titulo={config.titulo}
            cor={config.cor}
            categorias={categorias}
            valores={pontos.map(config.extrairValor)}
          />
        ))}
      </div>
    </section>
  )
}
