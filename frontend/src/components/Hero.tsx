// Secao inicial (hero): titulo grande com gradiente "arco-iris" Gruvbox e triangulos
// decorativos de fundo inspirados no wallpaper do tema Gruvbox Material do sistema
// (triangulos coloridos irradiando de um centro escuro).
import { motion } from 'framer-motion'

/** Um triangulo decorativo, posicionado e rotacionado livremente via className. */
function Triangulo({ cor, className }: { cor: string; className: string }) {
  return (
    <div
      className={`absolute blur-3xl ${className}`}
      style={{
        backgroundColor: cor,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }}
    />
  )
}

function TriangulosDecorativos() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-40">
      <Triangulo cor="#ea6962" className="-left-24 -top-24 h-72 w-72 rotate-[15deg]" />
      <Triangulo cor="#d8a657" className="left-1/3 -top-32 h-64 w-64 rotate-[5deg]" />
      <Triangulo cor="#a9b665" className="-right-20 -top-16 h-80 w-80 rotate-[-20deg]" />
      <Triangulo cor="#7daea3" className="-left-16 bottom-0 h-72 w-72 rotate-[160deg]" />
      <Triangulo cor="#d3869b" className="right-1/4 bottom-0 h-64 w-64 rotate-[200deg]" />
      <Triangulo cor="#d65d0e" className="-right-24 bottom-0 h-72 w-72 rotate-[140deg]" />
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
      <TriangulosDecorativos />

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-gruvbox-yellow"
      >
        Dados em tempo real
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="gradient-text text-5xl font-bold leading-tight sm:text-7xl"
      >
        O clima das 27
        <br />
        capitais do Brasil
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25 }}
        className="mt-6 max-w-xl text-lg text-muted"
      >
        Escolha uma cidade no seletor e acompanhe temperatura, umidade, vento e pressão
        atualizados, com gráficos de histórico animados.
      </motion.p>
    </section>
  )
}
