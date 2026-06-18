// Cards de vidro com os dados atuais da cidade selecionada: temperatura, umidade,
// vento e pressao. Busca os dados sempre que a cidade selecionada muda.
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Gauge, Thermometer, Wind } from 'lucide-react'
import { getWeatherCurrent } from '../api'
import type { WeatherCurrent } from '../types'

interface Props {
  cidadeSelecionada: string
}

export default function CurrentWeatherCard({ cidadeSelecionada }: Props) {
  const [clima, setClima] = useState<WeatherCurrent | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setCarregando(true)
    getWeatherCurrent(cidadeSelecionada)
      .then(setClima)
      .catch(() => setClima(null))
      .finally(() => setCarregando(false))
  }, [cidadeSelecionada])

  // Itens exibidos nos cards: extraidos em lista para evitar repetir o mesmo markup
  // quatro vezes (temperatura, umidade, vento, pressao).
  const itens = clima
    ? [
        { icone: Thermometer, rotulo: 'Temperatura', valor: `${clima.temperatura.toFixed(1)}°C` },
        { icone: Droplets, rotulo: 'Umidade', valor: `${clima.umidade}%` },
        { icone: Wind, rotulo: 'Vento', valor: `${clima.velocidade_vento.toFixed(1)} m/s` },
        { icone: Gauge, rotulo: 'Pressão', valor: `${clima.pressao} hPa` },
      ]
    : []

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">
        Agora em <span className="text-accent">{cidadeSelecionada}</span>
      </h2>

      {carregando && <p className="text-center text-white/50">Carregando...</p>}

      {!carregando && !clima && (
        <p className="text-center text-white/50">Sem dados disponiveis para esta cidade.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {itens.map((item, indice) => (
          <motion.div
            key={item.rotulo}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: indice * 0.08 }}
            className="glass-card flex flex-col items-center gap-2 px-4 py-6"
          >
            <item.icone className="h-6 w-6 text-accent" />
            <span className="text-2xl font-semibold">{item.valor}</span>
            <span className="text-xs text-white/50">{item.rotulo}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
