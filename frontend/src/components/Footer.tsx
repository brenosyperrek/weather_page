export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-10 text-center text-sm text-white/40">
      <p>
        Dados meteorologicos coletados via OpenWeatherMap pelo pipeline{' '}
        <span className="text-white/60">pipeline_dados</span> e armazenados em Postgres.
      </p>
    </footer>
  )
}
