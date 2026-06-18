// Um marcador (pequena esfera) posicionado sobre o globo 3D, representando uma capital.
// Fica destacado quando e a cidade atualmente selecionada e responde a clique/hover.
import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { Html } from '@react-three/drei'
import type { Capital } from '../types'

interface Props {
  capital: Capital
  posicao: [number, number, number]
  ativo: boolean
  onClick: () => void
}

export default function CityMarker({ capital, posicao, ativo, onClick }: Props) {
  const malhaRef = useRef<Mesh>(null)
  const [emHover, setEmHover] = useState(false)

  // Pulsa suavemente o marcador ativo a cada quadro, para chamar atencao sem distrair.
  useFrame(({ clock }) => {
    if (!malhaRef.current) return
    const escalaBase = ativo ? 1.6 : 1
    const pulso = ativo ? Math.sin(clock.elapsedTime * 3) * 0.15 : 0
    malhaRef.current.scale.setScalar(escalaBase + pulso)
  })

  return (
    <group position={posicao}>
      <mesh
        ref={malhaRef}
        onClick={(evento) => {
          evento.stopPropagation()
          onClick()
        }}
        onPointerOver={() => setEmHover(true)}
        onPointerOut={() => setEmHover(false)}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshStandardMaterial
          color={ativo ? '#5ac8fa' : '#0a84ff'}
          emissive={ativo ? '#5ac8fa' : '#0a84ff'}
          emissiveIntensity={ativo ? 1.2 : 0.5}
        />
      </mesh>

      {(emHover || ativo) && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white shadow-lg">
            {capital.nm_cidade}
          </div>
        </Html>
      )}
    </group>
  )
}
