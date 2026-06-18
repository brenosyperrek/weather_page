// Quatro graficos de linha 2D animados (ECharts) com o historico recente da cidade
// selecionada: temperatura, umidade, vento e pressao -- um grafico por parametro, cada
// um com sua propria escala, para nao misturar unidades muito diferentes no mesmo eixo.
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { getWeatherHistory } from '../api'
import type { WeatherHistoryPoint } from '../types'

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

/** Um unico grafico de linha animado para um parametro meteorologico. */
function GraficoParametro({ config, pontos }: { config: ConfigParametro; pontos: WeatherHistoryPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanciaRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const instancia = echarts.init(containerRef.current, 'dark', { renderer: 'svg' })
    instanciaRef.current = instancia

    const aoRedimensionar = () => instancia.resize()
    window.addEventListener('resize', aoRedimensionar)
    return () => {
      window.removeEventListener('resize', aoRedimensionar)
      instancia.dispose()
    }
  }, [])

  useEffect(() => {
    const instancia = instanciaRef.current
    if (!instancia) return

    const horarios = pontos.map((ponto) =>
      new Date(ponto.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    )

    instancia.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Inter, sans-serif' },
      grid: { left: 48, right: 24, top: 24, bottom: 48 },
      tooltip: { trigger: 'axis', className: 'echarts-tooltip-custom' },
      xAxis: {
        type: 'category',
        data: horarios,
        axisLine: { lineStyle: { color: 'rgba(212,190,152,0.25)' } },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(212,190,152,0.25)' } },
        splitLine: { lineStyle: { color: 'rgba(212,190,152,0.08)' } },
      },
      // animationDuration/easing controlam a animacao de entrada da linha/area.
      animationDuration: 900,
      animationEasing: 'cubicOut',
      series: [
        {
          type: 'line',
          data: pontos.map(config.extrairValor),
          smooth: true,
          symbol: 'none',
          lineStyle: { color: config.cor, width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${config.cor}59` },
              { offset: 1, color: `${config.cor}00` },
            ]),
          },
        },
      ],
    })
  }, [config, pontos])

  return (
    <div className="glass-card p-4">
      <h3 className="mb-2 px-2 text-sm font-medium" style={{ color: config.cor }}>{config.titulo}</h3>
      <div ref={containerRef} style={{ width: '100%', height: 260 }} />
    </div>
  )
}

export default function HistoryChartSection({ cidadeSelecionada }: Props) {
  const [pontos, setPontos] = useState<WeatherHistoryPoint[]>([])

  useEffect(() => {
    getWeatherHistory(cidadeSelecionada, 50).then(setPontos)
  }, [cidadeSelecionada])

  return (
    <section id="historico" className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Histórico recente</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PARAMETROS.map((config) => (
          <GraficoParametro key={config.titulo} config={config} pontos={pontos} />
        ))}
      </div>
    </section>
  )
}
