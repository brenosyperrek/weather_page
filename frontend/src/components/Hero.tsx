// Secao inicial (hero), no estilo das paginas de produto da Apple: titulo grande,
// gradiente de texto e uma frase de apoio curta, com animacao de entrada via Framer Motion.
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-accent"
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
        className="mt-6 max-w-xl text-lg text-white/60"
      >
        Escolha uma cidade no seletor ou gire o globo 3D para ver temperatura, umidade
        e vento atualizados, com historico e comparativo animados.
      </motion.p>
    </section>
  )
}
