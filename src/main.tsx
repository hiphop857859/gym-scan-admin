import ReactDOM from 'react-dom/client'
import { AuthAppStore } from './store/auth.store'
import Routers from './Routers'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import ErrorBoundary from './components/ErrorBoundary'
import AppModal from './components/Containers/ModalContainer/AppModal'
import { ModalStore } from './store/modal.store'
import { ThemeProvider } from './provider/ThemeProvider'
import ConfigProviderWrapper from './provider/ConfigProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <AuthAppStore.Provider>
    <ModalStore.Provider>
      <ThemeProvider>
        <ToastContainer />
        <ConfigProviderWrapper>
          <ErrorBoundary>
            <Routers />
            <AppModal />
          </ErrorBoundary>
        </ConfigProviderWrapper>
      </ThemeProvider>
    </ModalStore.Provider>
  </AuthAppStore.Provider>
)
