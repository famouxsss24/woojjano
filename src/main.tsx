import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="relative mx-auto h-full max-w-[480px] overflow-hidden bg-white shadow-[0_0_40px_rgba(0,0,0,0.12)]">
      <RouterProvider router={router} />
    </div>
  </StrictMode>,
)
