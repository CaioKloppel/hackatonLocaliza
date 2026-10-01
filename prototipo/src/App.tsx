import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { PrototypeBar } from './components/layout/PrototypeBar'
import { useHashRoute } from './hooks/useHashRoute'
import { ModeloPage } from './pages/ModeloPage/ModeloPage'

export function App() {
  const { rota, params } = useHashRoute()
  return (
    <>
      <PrototypeBar rota={rota} />
      <Header rota={rota} />
      <ModeloPage params={params} />
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
