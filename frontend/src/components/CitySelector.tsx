// Seletor de cidade acessivel: um <select> nativo estilizado, alternativa em texto ao
// globo 3D (clicar num marcador faz a mesma coisa). Usar <select> nativo garante
// suporte a teclado e leitores de tela sem precisar de uma lib extra.
import type { Capital } from '../types'

interface Props {
  capitais: Capital[]
  cidadeSelecionada: string
  aoSelecionar: (nmCidade: string) => void
}

export default function CitySelector({ capitais, cidadeSelecionada, aoSelecionar }: Props) {
  return (
    <label className="glass-card flex items-center gap-3 border border-transparent px-5 py-3 text-sm transition-colors focus-within:border-accent">
      <span className="text-muted">Cidade</span>
      <select
        value={cidadeSelecionada}
        onChange={(evento) => aoSelecionar(evento.target.value)}
        className="cursor-pointer bg-transparent font-medium text-gruvbox-fg outline-none [&>option]:bg-surface-800"
      >
        {capitais.map((capital) => (
          <option key={capital.id_cidade} value={capital.nm_cidade}>
            {capital.nm_cidade} — {capital.uf}
          </option>
        ))}
      </select>
    </label>
  )
}
