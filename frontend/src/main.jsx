import 'bootstrap/dist/css/bootstrap.min.css'; // السطر ده هو اللي بيلون الموقع!
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
// 1. اتأكدي إن السطر ده مكتوب ومفيش فيه غلطة في المسار
import { CartProvider } from './context/CartContext.jsx' 
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* 2. الـ CartProvider لازم يلف الـ App كده */}
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)