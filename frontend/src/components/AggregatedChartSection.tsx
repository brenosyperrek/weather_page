// Secao de evolucao por periodo: os mesmos 5 graficos (todos os parametros da tabela
// silver.capitais_weather) trocam de dados conforme o seletor Diario/Semanal/Mensal,
// em vez de viver em tres secoes fixas -- mais limpo e segue o estilo minimalista do
// resto da pagina. Temperatura tambem mostra a faixa minima/maxima do periodo.
import { useEffect, useState } from 'react'
import { getWeatherAggregated } from '../api'
import type { Granularidade, WeatherAggregatedPoint } from '../types'
import ParameterLineChart from './charts/ParameterLineChart'

interface Props {
  cidadeSelecionada: string
}

interface OpcaoGranularidade {
  valor: Granularidade
  rotulo: string
  limit: number
}

// Quantos periodos buscar por granularidade: ~1 mes de dias, ~3 meses de semanas,
// ~1 ano de meses -- ainda poucos pontos hoje (a coleta comecou ha pouco), mas a janela
// certa para quando o pipeline acumular mais historico.
const OPCOES: OpcaoGranularidade[] = [
  { valor: 'dia', rotulo: 'Diário', limit: 30 },
  { valor: 'semana', rotulo: 'Semanal', limit: 12 },
  { valor: 'mes', rotulo: 'Mensal', limit: 12 },
]

function formatarRotulo(periodo: string, granularidade: Granularidade): string {
  const data = new Date(periodo)
  if (granularidade === 'mes') {
    return data.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
  }
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function AggregatedChartSection({ cidadeSelecionada }: Props) {
  const [granularidade, setGranularidade] = useState<Granularidade>('dia')
  const [pontos, setPontos] = useState<WeatherAggregatedPoint[]>([])

  useEffect(() => {
    const opcao = OPCOES.find((o) => o.valor === granularidade) ?? OPCOES[0]
    getWeatherAggregated(cidadeSelecionada, granularidade, opcao.limit).then(setPontos)
  }, [cidadeSelecionada, granularidade])

  const categorias = pontos.map((ponto) => formatarRotulo(ponto.periodo, granularidade))

  return (
    <section id="evolucao" className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">Evolução por período</h2>

      <div className="mb-6 flex justify-center gap-2">
        {OPCOES.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => setGranularidade(opcao.valor)}
            className={`glass-card rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              granularidade === opcao.valor ? 'border-accent text-accent' : 'border-transparent text-muted'
            }`}
          >
            {opcao.rotulo}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ParameterLineChart
          titulo="Temperatura (°C)"
          cor="#ea6962"
          categorias={categorias}
          valores={pontos.map((p) => p.temperatura_media)}
          faixa={{
            min: pontos.map((p) => p.temperatura_min),
            max: pontos.map((p) => p.temperatura_max),
          }}
        />
        <ParameterLineChart
          titulo="Umidade (%)"
          cor="#7daea3"
          categorias={categorias}
          valores={pontos.map((p) => p.umidade_media)}
        />
        <ParameterLineChart
          titulo="Vento (m/s)"
          cor="#d3869b"
          categorias={categorias}
          valores={pontos.map((p) => p.velocidade_vento_media)}
        />
        <ParameterLineChart
          titulo="Pressão (hPa)"
          cor="#d8a657"
          categorias={categorias}
          valores={pontos.map((p) => p.pressao_media)}
        />
        <ParameterLineChart
          titulo="Visibilidade (m)"
          cor="#89b482"
          categorias={categorias}
          valores={pontos.map((p) => p.visibilidade_media)}
        />
      </div>
    </section>
  )
}
