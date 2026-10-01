import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { ToastProvider } from '../components/ui/Toast'
import { ModoProvider } from '../modo/ModoContext'

export function renderComProviders(ui: ReactElement, url = '/') {
  window.history.replaceState(null, '', url)
  return render(
    <ModoProvider>
      <ToastProvider>{ui}</ToastProvider>
    </ModoProvider>,
  )
}
