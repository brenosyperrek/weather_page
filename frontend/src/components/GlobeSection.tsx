// Globo 3D interativo (react-three-fiber): um seletor de cidade alternativo ao
// dropdown, onde o usuario arrasta para girar e clica num marcador para escolher a capital.
import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import { getCapitais } from '../api'
import type { Capital } from '../types'
import CityMarker from './CityMarker'

const RAIO_GLOBO = 2

/** Converte latitude/longitude (graus) na posicao [x, y, z] sobre a superficie da esfera. */
function latLonParaVetor3(latitude: number, longitude: number, raio: number): [number, number, number] {
  const phi = ((90 - latitude) * Math.PI) / 180
  const theta = ((longitude + 180) * Math.PI) / 180
  const x = -raio * Math.sin(phi) * Math.cos(theta)
  const z = raio * Math.sin(phi) * Math.sin(theta)
  const y = raio * Math.cos(phi)
  return [x, y, z]
}

interface Props {
  cidadeSelecionada: string
  aoSelecionar: (nmCidade: string) => void
}

export default function GlobeSection({ cidadeSelecionada, aoSelecionar }: Props) {
  const [capitais, setCapitais] = useState<Capital[]>([])

  useEffect(() => {
    getCapitais().then(setCapitais)
  }, [])

  return (
    <section id="globo" className="mx-auto max-w-5xl px-6 py-12">
      <h2 className="mb-2 text-center text-2xl font-semibold">Gire o globo</h2>
      <p className="mb-6 text-center text-sm text-white/50">
        Arraste para girar, ou clique em uma capital para selecioná-la.
      </p>
      <div className="glass-card overflow-hidden" style={{ height: 520 }}>
        <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 3, 5]} intensity={1.2} />

            {/* Estrelas de fundo, so para dar profundidade a cena (efeito puramente visual) */}
            <Stars radius={50} depth={20} count={2000} factor={2} fade />

            {/* Esfera principal representando a Terra, em um azul escuro estilizado */}
            <Sphere args={[RAIO_GLOBO, 64, 64]}>
              <meshStandardMaterial color="#0a1628" roughness={0.6} metalness={0.2} />
            </Sphere>

            {/* Esfera levemente maior, em wireframe, para sugerir o grid de latitude/longitude */}
            <Sphere args={[RAIO_GLOBO + 0.01, 24, 24]}>
              <meshBasicMaterial color="#0a84ff" wireframe transparent opacity={0.15} />
            </Sphere>

            {capitais.map((capital) => (
              <CityMarker
                key={capital.id_cidade}
                capital={capital}
                posicao={latLonParaVetor3(capital.latitude, capital.longitude, RAIO_GLOBO + 0.04)}
                ativo={capital.nm_cidade === cidadeSelecionada}
                onClick={() => aoSelecionar(capital.nm_cidade)}
              />
            ))}

            <OrbitControls
              enablePan={false}
              minDistance={3}
              maxDistance={9}
              autoRotate
              autoRotateSpeed={0.6}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  )
}
