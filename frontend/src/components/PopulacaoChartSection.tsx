// Secao com graficos de barras (ECharts) das informacoes populacionais das 27 capitais:
// populacao total e densidade demografica, ambos ordenados do maior para o menor. A
// cidade selecionada (mesmo estado compartilhado com o mapa) fica destacada nas barras.
import { useEffect, useState } from 'react'
import { getPopulacao } from '../api'
import type { Populacao } from '../types'
import PopulationBarChart from './charts/PopulationBarChart'

interface Props {
  cidadeSelecionada: string
}

const formatarInteiro = (valor: number) => valor.toLocaleString('pt-BR')
const formatarDensidade = (valor: number) => `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} hab/km²`

export default function PopulacaoChartSection({ cidadeSelecionada }: Props) {
  const [populacoes, setPopulacoes] = useState<Populacao[]>([])

  useEffect(() => {
    getPopulacao().then(setPopulacoes)
  }, [])

  const porPopulacao = [...populacoes]
    .sort((a, b) => b.populacao - a.populacao)
    .map((p) => ({ nmCidade: p.nm_cidade, valor: p.populacao }))

  const porDensidade = [...populacoes]
    .sort((a, b) => b.densidade_demografica - a.densidade_demografica)
    .map((p) => ({ nmCidade: p.nm_cidade, valor: p.densidade_demografica }))

  return (
    <section id="populacao" className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-2 text-center text-2xl font-semibold">Informações populacionais</h2>
      <p className="mb-6 text-center text-sm text-muted">
        População residente e densidade demográfica das 27 capitais brasileiras (IBGE).
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PopulationBarChart
          titulo="População total"
          cor="#89b482"
          itens={porPopulacao}
          cidadeSelecionada={cidadeSelecionada}
          formatarValor={formatarInteiro}
        />
        <PopulationBarChart
          titulo="Densidade demográfica"
          cor="#d8a657"
          itens={porDensidade}
          cidadeSelecionada={cidadeSelecionada}
          formatarValor={formatarDensidade}
        />
      </div>
    </section>
  )
}
