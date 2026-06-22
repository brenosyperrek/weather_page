// Grafico de linha 2D animado (ECharts) para um unico parametro meteorologico. Recebe os
// dados ja formatados (categorias do eixo X e valores) em vez de pontos brutos, para servir
// tanto o historico recente (rotulos por hora) quanto os graficos agregados por periodo
// (rotulos por dia/semana/mes). Opcionalmente desenha uma faixa min/max sob a linha
// principal (usada no grafico de temperatura, como em previsoes tradicionais de tempo).
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface Faixa {
  min: number[]
  max: number[]
}

interface Props {
  titulo: string
  cor: string
  categorias: string[]
  // null representa ausencia de leitura no periodo (ex: visibilidade nem sempre vem da
  // API) -- o ECharts desenha um vao no lugar, em vez de quebrar o grafico.
  valores: (number | null)[]
  faixa?: Faixa
}

export default function ParameterLineChart({ titulo, cor, categorias, valores, faixa }: Props) {
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

    // Com poucos pontos (tipico das visoes semanal/mensal enquanto o historico e curto),
    // uma linha sem simbolo nao desenha nada -- precisa de pelo menos 2 pontos para haver
    // um segmento. Mostrar o circulo nesses casos evita um grafico aparentemente vazio.
    const simbolo = categorias.length <= 2 ? 'circle' : 'none'

    // Quando ha faixa min/max, a linha principal e desenhada sobre uma area empilhada:
    // uma serie invisivel ate o "min" e outra que sobe o delta (max - min), preenchida e
    // translucida -- a tecnica padrao do ECharts para bandas min/max.
    const seriesFaixa: echarts.SeriesOption[] = faixa
      ? [
          {
            name: 'faixa-min',
            type: 'line',
            data: faixa.min,
            stack: 'faixa',
            symbol: simbolo,
            symbolSize: 6,
            itemStyle: { color: `${cor}59` },
            lineStyle: { opacity: 0 },
            areaStyle: { opacity: 0 },
          },
          {
            name: 'faixa-delta',
            type: 'line',
            data: faixa.max.map((max, i) => max - faixa.min[i]),
            stack: 'faixa',
            // simbolo visivel tambem na faixa quando ha so 1-2 pontos, senao a banda
            // some junto com a linha principal pelo mesmo motivo (sem segmento p/ desenhar).
            symbol: simbolo,
            symbolSize: 6,
            itemStyle: { color: `${cor}59` },
            lineStyle: { opacity: 0 },
            areaStyle: { color: `${cor}33` },
          },
        ]
      : []

    instancia.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Inter, sans-serif' },
      grid: { left: 48, right: 24, top: 24, bottom: 48 },
      tooltip: {
        trigger: 'axis',
        className: 'echarts-tooltip-custom',
        // Formatter customizado: usa apenas o indice para ler media/min/max diretamente
        // dos arrays originais, em vez de depender das series auxiliares da faixa.
        formatter: (params: echarts.DefaultLabelFormatterCallbackParams[] | echarts.DefaultLabelFormatterCallbackParams) => {
          const lista = Array.isArray(params) ? params : [params]
          const indice = lista[0]?.dataIndex ?? 0
          const valor = valores[indice]
          const linhas = [`${categorias[indice]}`, `${titulo}: ${valor == null ? '—' : valor.toFixed(1)}`]
          if (faixa) {
            linhas.push(`Mínima: ${faixa.min[indice].toFixed(1)}`, `Máxima: ${faixa.max[indice].toFixed(1)}`)
          }
          return linhas.join('<br/>')
        },
      },
      xAxis: {
        type: 'category',
        data: categorias,
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
        ...seriesFaixa,
        {
          name: titulo,
          type: 'line',
          data: valores,
          smooth: true,
          symbol: simbolo,
          symbolSize: 6,
          itemStyle: { color: cor },
          lineStyle: { color: cor, width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: `${cor}59` },
              { offset: 1, color: `${cor}00` },
            ]),
          },
        },
      ],
    })
  }, [titulo, cor, categorias, valores, faixa])

  return (
    <div className="glass-card p-4">
      <h3 className="mb-2 px-2 text-sm font-medium" style={{ color: cor }}>{titulo}</h3>
      <div ref={containerRef} style={{ width: '100%', height: 260 }} />
    </div>
  )
}
