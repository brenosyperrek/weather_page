// Barra de navegacao fixa no topo, com efeito de vidro (glass-nav, ver index.css) que
// fica mais opaco conforme a pagina rola, igual ao comportamento do menu do site da Apple.
import { useEffect, useState } from 'react'
import { CloudSun } from 'lucide-react'

export default function Navbar() {
  // Controla se o usuario ja rolou a pagina, para intensificar o efeito de vidro.
  const [rolou, setRolou] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 12)
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${rolou ? 'glass-nav' : 'bg-transparent'}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wide">
          <CloudSun className="h-5 w-5 text-gruvbox-yellow" />
          <span>Clima das Capitais</span>
        </div>
        <a
          href="#historico"
          className="text-sm text-muted transition-colors hover:text-gruvbox-yellow"
        >
          Ver histórico
        </a>
      </div>
    </nav>
  )
}
