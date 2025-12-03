import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';

import { EventosProvider } from "./context/EventosContext.jsx";

import App from './App.jsx'



<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
/>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventosProvider>
       <App />
    </EventosProvider>
   
  </StrictMode>,
)


