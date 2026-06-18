export default function Footer() {
  return (
    <footer className="border-t border-surface-700 px-6 py-10 text-center text-sm text-muted">
      <p>
        Dados meteorologicos coletados via OpenWeatherMap pelo pipeline{' '}
        <span className="text-accent">pipeline_dados</span> e armazenados em Postgres.
      </p>
    </footer>
  )
}
