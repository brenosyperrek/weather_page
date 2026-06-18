// Grafico de linha 2D animado com o historico de temperatura/umidade da cidade
// selecionada, desenhado com ECharts (animacao nativa da biblioteca ao trocar de dados).
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { getWeatherHistory } from '../api'

interface Props {
  cidadeSelecionada: string
}

export default function HistoryChartSection({ cidadeSelecionada }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Guarda a instancia do grafico entre renders, para reaproveitar (setOption) em vez
  // de recriar o canvas a cada troca de cidade -- e o que produz a animacao de transicao.
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
    getWeatherHistory(cidadeSelecionada, 50).then((pontos) => {
      const instancia = instanciaRef.current
      if (!instancia) return

      const horarios = pontos.map((ponto) =>
        new Date(ponto.data).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      )

      instancia.setOption({
        backgroundColor: 'transparent',
        textStyle: { fontFamily: 'Inter, sans-serif' },
        grid: { left: 48, right: 24, top: 32, bottom: 48 },
        tooltip: { trigger: 'axis', className: 'echarts-tooltip-custom' },
        legend: { data: ['Temperatura (°C)', 'Umidade (%)'], textStyle: { color: '#f5f5f7' } },
        xAxis: {
          type: 'category',
          data: horarios,
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
          splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
        },
        // animationDuration/easing controlam a animacao de entrada das linhas/area.
        animationDuration: 900,
        animationEasing: 'cubicOut',
        series: [
          {
            name: 'Temperatura (°C)',
            type: 'line',
            data: pontos.map((p) => p.temperatura),
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#0a84ff', width: 3 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(10,132,255,0.35)' },
                { offset: 1, color: 'rgba(10,132,255,0)' },
              ]),
            },
          },
          {
            name: 'Umidade (%)',
            type: 'line',
            data: pontos.map((p) => p.umidade),
            smooth: true,
            symbol: 'none',
            lineStyle: { color: '#bf5af2', width: 2 },
          },
        ],
      })
    })
  }, [cidadeSelecionada])

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Histórico recente</h2>
      <div className="glass-card p-4">
        <div ref={containerRef} style={{ width: '100%', height: 360 }} />
      </div>
    </section>
  )
}
