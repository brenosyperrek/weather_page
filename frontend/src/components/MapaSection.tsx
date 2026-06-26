// Mapa do Brasil (Leaflet) com um marcador por capital. Clicar em um marcador
// seleciona a cidade (mesmo estado compartilhado com o CitySelector) e abre, no canto
// superior direito do mapa, um quadro flutuante com as informacoes meteorologicas
// atuais daquela cidade.
import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { motion } from 'framer-motion'
import { Droplets, Gauge, MapPin, Thermometer, Users, Wind } from 'lucide-react'
import { getPopulacao, getWeatherCurrent } from '../api'
import type { Capital, Populacao, WeatherCurrent } from '../types'

interface Props {
  capitais: Capital[]
  cidadeSelecionada: string
  aoSelecionar: (nmCidade: string) => void
}

const formatarPopulacao = (valor: number) => valor.toLocaleString('pt-BR')
const formatarDensidade = (valor: number) => `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} hab/km²`

// Depois de o mapa ser montado dentro de uma secao que ainda esta animando (ou fora da
// tela), o Leaflet pode calcular o tamanho do container errado. Isso recalcula e
// recentraliza pouco depois da montagem, evitando tiles cortadas/deslocadas.
function RecalcularTamanho() {
  const mapa = useMap()
  useEffect(() => {
    const tempo = setTimeout(() => {
      const centro = mapa.getCenter()
      const zoom = mapa.getZoom()
      mapa.invalidateSize({ animate: false })
      mapa.setView(centro, zoom, { animate: false })
    }, 400)
    return () => clearTimeout(tempo)
  }, [mapa])
  return null
}

/** Quadro flutuante no canto superior direito do mapa com o clima e os dados
 * populacionais (populacao total e densidade demografica) da cidade selecionada. */
function PainelClimaFlutuante({
  cidadeSelecionada,
  populacao,
}: {
  cidadeSelecionada: string
  populacao: Populacao | undefined
}) {
  const [clima, setClima] = useState<WeatherCurrent | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setCarregando(true)
    getWeatherCurrent(cidadeSelecionada)
      .then(setClima)
      .catch(() => setClima(null))
      .finally(() => setCarregando(false))
  }, [cidadeSelecionada])

  const itens = clima
    ? [
        { icone: Thermometer, valor: `${clima.temperatura.toFixed(1)}°C`, cor: '#ea6962' },
        { icone: Droplets, valor: `${clima.umidade}%`, cor: '#7daea3' },
        { icone: Wind, valor: `${clima.velocidade_vento.toFixed(1)} m/s`, cor: '#d3869b' },
        { icone: Gauge, valor: `${clima.pressao} hPa`, cor: '#d8a657' },
      ]
    : []

  return (
    <motion.div
      key={cidadeSelecionada}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card absolute right-3 top-3 z-[500] w-56 p-4"
    >
      <h3 className="mb-3 text-sm font-semibold text-gruvbox-fg">{cidadeSelecionada}</h3>

      {carregando && <p className="text-xs text-muted">Carregando...</p>}
      {!carregando && !clima && <p className="text-xs text-muted">Sem dados disponíveis.</p>}

      {clima && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {itens.map((item) => (
            <div key={item.valor} className="flex items-center gap-1.5">
              <item.icone className="h-4 w-4 shrink-0" style={{ color: item.cor }} />
              <span className="text-xs font-medium text-gruvbox-fg">{item.valor}</span>
            </div>
          ))}
        </div>
      )}

      {populacao && (
        <div className="grid grid-cols-1 gap-2 border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 shrink-0" style={{ color: '#89b482' }} />
            <span className="text-xs font-medium text-gruvbox-fg">
              {formatarPopulacao(populacao.populacao)} habitantes
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0" style={{ color: '#d8a657' }} />
            <span className="text-xs font-medium text-gruvbox-fg">
              {formatarDensidade(populacao.densidade_demografica)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function MapaSection({ capitais, cidadeSelecionada, aoSelecionar }: Props) {
  // O MapContainer so e montado quando a secao entra na tela: assim o Leaflet sempre
  // mede um container com altura/largura reais, em vez de 0 (secao ainda fora da tela).
  const [mapaMontado, setMapaMontado] = useState(false)
  const sentinelaRef = useRef<HTMLDivElement>(null)

  // Populacao/densidade de cada capital (dados estaticos, ver app/populacao.py no
  // backend): buscado uma unica vez e usado tanto no raio dos marcadores quanto no
  // tooltip e no painel flutuante.
  const [populacoes, setPopulacoes] = useState<Populacao[]>([])

  useEffect(() => {
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setMapaMontado(true)
          observador.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    if (sentinelaRef.current) observador.observe(sentinelaRef.current)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    getPopulacao().then(setPopulacoes)
  }, [])

  const populacaoPorCidade = new Map(populacoes.map((p) => [p.nm_cidade, p]))

  // Raio do marcador proporcional a populacao (escala em raiz quadrada, para o tamanho
  // visual crescer de forma proporcional a area do circulo, nao a populacao bruta --
  // senao Sao Paulo dominaria o mapa). Sem dados ainda, cai no raio fixo de antes.
  const populacoesValidas = populacoes.map((p) => p.populacao)
  const minPop = populacoesValidas.length ? Math.min(...populacoesValidas) : 0
  const maxPop = populacoesValidas.length ? Math.max(...populacoesValidas) : 1
  const raioBase = (populacao: number | undefined) => {
    if (populacao == null || maxPop === minPop) return 6
    const proporcao = Math.sqrt((populacao - minPop) / (maxPop - minPop))
    return 6 + proporcao * 12
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-2 text-center text-2xl font-semibold">Mapa das capitais</h2>
      <p className="mb-6 text-center text-sm text-muted">
        Clique em uma capital no mapa para selecioná-la.
      </p>

      <div ref={sentinelaRef} className="glass-card relative overflow-hidden p-0" style={{ height: 520 }}>
        {mapaMontado && (
          <MapContainer
            center={[-15.78, -47.93]}
            zoom={4}
            minZoom={3}
            maxZoom={8}
            scrollWheelZoom={false}
            style={{ height: 520, width: '100%', background: 'transparent' }}
          >
            <RecalcularTamanho />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              subdomains="abcd"
              maxZoom={19}
            />

            {capitais.map((capital) => {
              const ativo = capital.nm_cidade === cidadeSelecionada
              const populacao = populacaoPorCidade.get(capital.nm_cidade)
              return (
                <CircleMarker
                  key={capital.id_cidade}
                  center={[capital.latitude, capital.longitude]}
                  radius={raioBase(populacao?.populacao) + (ativo ? 3 : 0)}
                  pathOptions={{
                    color: ativo ? '#d8a657' : '#7daea3',
                    fillColor: ativo ? '#d8a657' : '#7daea3',
                    fillOpacity: ativo ? 0.9 : 0.55,
                    weight: ativo ? 2 : 1,
                  }}
                  eventHandlers={{ click: () => aoSelecionar(capital.nm_cidade) }}
                >
                  <Tooltip direction="top" offset={[0, -6]}>
                    <div className="text-xs">
                      <strong>
                        {capital.nm_cidade} — {capital.uf}
                      </strong>
                      {populacao && (
                        <>
                          <br />
                          {formatarPopulacao(populacao.populacao)} habitantes
                          <br />
                          {formatarDensidade(populacao.densidade_demografica)}
                        </>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              )
            })}
          </MapContainer>
        )}

        {mapaMontado && (
          <PainelClimaFlutuante
            cidadeSelecionada={cidadeSelecionada}
            populacao={populacaoPorCidade.get(cidadeSelecionada)}
          />
        )}
      </div>
    </section>
  )
}
