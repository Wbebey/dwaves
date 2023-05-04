import { useState } from 'react'
import './App.css'
import logo from './assets/logo-dwaves.png'

function App() {
  const [count, setCount] = useState(0)

  console.log(import.meta.env.VITE_APP_DWAVESAPP_URL)

  return (
    <div className="App">
      <a href={import.meta.env.VITE_APP_DWAVESAPP_URL}>
        <img src={logo} alt="" />
      </a>
    </div>
  )
}

export default App
