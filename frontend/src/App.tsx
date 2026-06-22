// Componente raiz: busca a lista de capitais, mantem o estado de "cidade selecionada"
// (usado pelo dropdown e por todas as secoes que mostram dados da cidade) e renderiza
// todas as secoes da pagina.
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CitySelector from './components/CitySelector'
import MapaSection from './components/MapaSection'
import CurrentWeatherCard from './components/CurrentWeatherCard'
import HistoryChartSection from './components/HistoryChartSection'
import AggregatedChartSection from './components/AggregatedChartSection'
import Footer from './components/Footer'
import { getCapitais } from './api'
import type { Capital } from './types'

export default function App() {
  const [capitais, setCapitais] = useState<Capital[]>([])
  // Florianopolis como cidade inicial (sede do projeto pipeline_dados/weather_page).
  const [cidadeSelecionada, setCidadeSelecionada] = useState('Florianópolis')

  useEffect(() => {
    getCapitais().then(setCapitais)
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <div className="mx-auto flex max-w-5xl justify-center px-6">
        <CitySelector
          capitais={capitais}
          cidadeSelecionada={cidadeSelecionada}
          aoSelecionar={setCidadeSelecionada}
        />
      </div>

      <MapaSection
        capitais={capitais}
        cidadeSelecionada={cidadeSelecionada}
        aoSelecionar={setCidadeSelecionada}
      />
      <div className="section-divider mx-auto max-w-5xl" />
      <CurrentWeatherCard cidadeSelecionada={cidadeSelecionada} />
      <div className="section-divider mx-auto max-w-5xl" />
      <HistoryChartSection cidadeSelecionada={cidadeSelecionada} />
      <div className="section-divider mx-auto max-w-5xl" />
      <AggregatedChartSection cidadeSelecionada={cidadeSelecionada} />

      <Footer />
    </div>
  )
}
