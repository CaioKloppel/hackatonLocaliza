import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { PrototypeBar } from './components/layout/PrototypeBar'
import { useEffect } from 'react'
import { useHashRoute } from './hooks/useHashRoute'
import { useModo } from './modo/ModoContext'
import { AssinantePage } from './pages/AssinantePage/AssinantePage'
import { ModeloPage } from './pages/ModeloPage/ModeloPage'
import { RelatorioPage } from './pages/RelatorioPage/RelatorioPage'

export function App() {
  const { rota, params } = useHashRoute()
  const { setModo } = useModo()

  // As telas do assinante e do relatório só existem na proposta (spec §3.2).
  useEffect(() => {
    if (rota !== 'modelo') setModo('proposta')
  }, [rota, setModo])
  return (
    <>
      <PrototypeBar rota={rota} />
      <Header rota={rota} />
      {rota === 'assinante' ? (
        <AssinantePage />
      ) : rota === 'relatorio' ? (
        <RelatorioPage />
      ) : (
        <ModeloPage params={params} />
      )}
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
