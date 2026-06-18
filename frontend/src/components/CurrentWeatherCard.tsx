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
  // quatro vezes (temperatura, umidade, vento, pressao). Cada parametro tem sua propria
  // cor Gruvbox, para o painel ficar colorido em vez de monocromatico.
  const itens = clima
    ? [
        { icone: Thermometer, rotulo: 'Temperatura', valor: `${clima.temperatura.toFixed(1)}°C`, cor: '#ea6962' },
        { icone: Droplets, rotulo: 'Umidade', valor: `${clima.umidade}%`, cor: '#7daea3' },
        { icone: Wind, rotulo: 'Vento', valor: `${clima.velocidade_vento.toFixed(1)} m/s`, cor: '#d3869b' },
        { icone: Gauge, rotulo: 'Pressão', valor: `${clima.pressao} hPa`, cor: '#d8a657' },
      ]
    : []

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-6 text-center text-2xl font-semibold">
        Agora em <span className="text-accent">{cidadeSelecionada}</span>
      </h2>

      {carregando && <p className="text-center text-muted">Carregando...</p>}

      {!carregando && !clima && (
        <p className="text-center text-muted">Sem dados disponiveis para esta cidade.</p>
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
            <item.icone className="h-6 w-6" style={{ color: item.cor }} />
            <span className="text-2xl font-semibold">{item.valor}</span>
            <span className="text-xs text-muted">{item.rotulo}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
