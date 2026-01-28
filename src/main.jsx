import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import Navbar from './components/Navbar'
import Footerbar from './components/Footerbar'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <App />
        <Footerbar/>

  </React.StrictMode>
)
