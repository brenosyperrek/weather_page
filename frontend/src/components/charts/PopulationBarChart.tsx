// Grafico de barras horizontal (ECharts) com um valor populacional por capital (populacao
// total ou densidade demografica). Horizontal porque sao 27 categorias -- rotulos de
// cidade ficam legiveis no eixo Y, em vez de espremidos/rotacionados no eixo X. A barra
// da cidade selecionada (mesmo estado compartilhado com o mapa e o seletor) fica em
// destaque, as demais ficam em um tom neutro.
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

interface Item {
  nmCidade: string
  valor: number
}

interface Props {
  titulo: string
  cor: string
  itens: Item[]
  cidadeSelecionada: string
  formatarValor: (valor: number) => string
}

export default function PopulationBarChart({ titulo, cor, itens, cidadeSelecionada, formatarValor }: Props) {
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

    // Ordem crescente: o ECharts desenha categorias de baixo para cima, entao a maior
    // barra (primeiro item, jah ordenado desc pelo componente pai) precisa ficar no
    // topo da lista invertendo aqui.
    const ordenados = [...itens].reverse()

    instancia.setOption({
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Inter, sans-serif' },
      grid: { left: 110, right: 24, top: 16, bottom: 32 },
      tooltip: {
        trigger: 'axis',
        className: 'echarts-tooltip-custom',
        axisPointer: { type: 'shadow' },
        formatter: (params: echarts.DefaultLabelFormatterCallbackParams[] | echarts.DefaultLabelFormatterCallbackParams) => {
          const lista = Array.isArray(params) ? params : [params]
          const indice = lista[0]?.dataIndex ?? 0
          const item = ordenados[indice]
          return `${item.nmCidade}<br/>${titulo}: ${formatarValor(item.valor)}`
        },
      },
      xAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: 'rgba(212,190,152,0.25)' } },
        splitLine: { lineStyle: { color: 'rgba(212,190,152,0.08)' } },
        axisLabel: { formatter: (valor: number) => formatarValor(valor) },
      },
      yAxis: {
        type: 'category',
        data: ordenados.map((item) => item.nmCidade),
        axisLine: { lineStyle: { color: 'rgba(212,190,152,0.25)' } },
        axisLabel: { fontSize: 11 },
      },
      animationDuration: 900,
      animationEasing: 'cubicOut',
      series: [
        {
          name: titulo,
          type: 'bar',
          data: ordenados.map((item) => ({
            value: item.valor,
            itemStyle: {
              color: item.nmCidade === cidadeSelecionada ? cor : `${cor}55`,
            },
          })),
          barCategoryGap: '30%',
        },
      ],
    })
  }, [titulo, cor, itens, cidadeSelecionada, formatarValor])

  return (
    <div className="glass-card p-4">
      <h3 className="mb-2 px-2 text-sm font-medium" style={{ color: cor }}>{titulo}</h3>
      <div ref={containerRef} style={{ width: '100%', height: 620 }} />
    </div>
  )
}
