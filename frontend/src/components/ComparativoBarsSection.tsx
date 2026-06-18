// Grafico de barras 3D (echarts-gl) comparando temperatura e umidade das 27 capitais
// de uma vez. A grade gira sozinha (autoRotate) para reforcar a sensacao de "vivo".
import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl'
import { getComparativo } from '../api'

const METRICAS = ['Temperatura (°C)', 'Umidade (%)']

export default function ComparativoBarsSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const instancia = echarts.init(containerRef.current, 'dark')

    getComparativo().then((itens) => {
      const cidades = itens.map((item) => item.uf)

      // bar3D espera pontos no formato [indiceX, indiceY, valor]. Aqui X = cidade (UF),
      // Y = metrica (temperatura ou umidade), Z = o valor em si.
      const dados = itens.flatMap((item, indiceCidade) => [
        [indiceCidade, 0, Math.round(item.temperatura * 10) / 10],
        [indiceCidade, 1, item.umidade],
      ])

      instancia.setOption({
        backgroundColor: 'transparent',
        tooltip: {},
        xAxis3D: { type: 'category', data: cidades, axisLabel: { textStyle: { color: '#f5f5f7' } } },
        yAxis3D: { type: 'category', data: METRICAS, axisLabel: { textStyle: { color: '#f5f5f7' } } },
        zAxis3D: { type: 'value', axisLabel: { textStyle: { color: '#f5f5f7' } } },
        grid3D: {
          boxWidth: 200,
          boxDepth: 80,
          // Faz a cena girar continuamente sem precisar o usuario arrastar -- o pedido
          // do usuario foi por graficos "animados e 3D".
          viewControl: { autoRotate: true, autoRotateSpeed: 6, distance: 220 },
          light: {
            main: { intensity: 1.4, shadow: true },
            ambient: { intensity: 0.4 },
          },
        },
        series: [
          {
            type: 'bar3D',
            data: dados,
            shading: 'lambert',
            itemStyle: { color: '#0a84ff' },
            emphasis: { itemStyle: { color: '#5ac8fa' } },
          },
        ],
      })
    })

    const aoRedimensionar = () => instancia.resize()
    window.addEventListener('resize', aoRedimensionar)
    return () => {
      window.removeEventListener('resize', aoRedimensionar)
      instancia.dispose()
    }
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-2 text-center text-2xl font-semibold">Comparativo entre capitais</h2>
      <p className="mb-6 text-center text-sm text-white/50">
        Temperatura e umidade mais recentes de todas as 27 capitais, em 3D.
      </p>
      <div className="glass-card p-4">
        <div ref={containerRef} style={{ width: '100%', height: 480 }} />
      </div>
    </section>
  )
}
