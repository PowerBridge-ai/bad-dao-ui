import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Ethereum, Base, BaseGoerli } from '@thirdweb-dev/chains';
import App from './App';
import './index.css';
import './localization/i18n';

// You can add more supported chains as needed
const supportedChains = [Ethereum, Base, BaseGoerli];

// Using a placeholder client ID - replace with your actual client ID in production
const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID || "temporary-thirdweb-client-id-for-development";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider
      clientId={clientId}
      supportedChains={supportedChains}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </StrictMode>
);