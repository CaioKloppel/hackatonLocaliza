import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { PrototypeBar } from './components/layout/PrototypeBar'
import { useEffect } from 'react'
import { useHashRoute } from './hooks/useHashRoute'
import { useModo } from './modo/ModoContext'
import { AssinantePage } from './pages/AssinantePage/AssinantePage'
import { ModeloPage } from './pages/ModeloPage/ModeloPage'

export function App() {
  const { rota, params } = useHashRoute()
  const { setModo } = useModo()

  // A tela do assinante só existe na proposta (spec §3.2).
  useEffect(() => {
    if (rota === 'assinante') setModo('proposta')
  }, [rota, setModo])
  return (
    <>
      <PrototypeBar rota={rota} />
      <Header rota={rota} />
      {rota === 'assinante' ? <AssinantePage /> : <ModeloPage params={params} />}
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
