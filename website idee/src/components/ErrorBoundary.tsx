import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  fout: boolean
  offline: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { fout: false, offline: typeof navigator !== 'undefined' && !navigator.onLine }

  static getDerivedStateFromError(): State {
    return { fout: true, offline: typeof navigator !== 'undefined' && !navigator.onLine }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Onverwachte renderfout', error, info)
  }

  render() {
    if (!this.state.fout) return this.props.children

    return (
      <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
        <section role="alert" style={{ maxWidth: 560, textAlign: 'center' }}>
          <h1>{this.state.offline ? 'Je bent offline' : 'Er ging iets mis'}</h1>
          <p>
            {this.state.offline
              ? 'Controleer je internetverbinding en probeer het opnieuw.'
              : 'De pagina kon niet worden geladen. Probeer opnieuw te laden.'}
          </p>
          <button className="knop" type="button" onClick={() => window.location.reload()}>
            Pagina opnieuw laden
          </button>
        </section>
      </main>
    )
  }
}
