import 'styles/Login.scss'
import { Login, Register } from 'components'

import { useState } from 'react'
interface Props {
  toggleModal: () => void
  setConnected: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalLogin: React.FC<Props> = ({ toggleModal, setConnected }) => {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div id="contain-modal">
      <div id="modal">
        <header>
          <img onClick={toggleModal} src="/logo-dwaves.png" alt="" />
          <div className="tabs">
            <div
              onClick={() => {
                setShowLogin(true)
              }}
              className={`tab tab-lg tab-lifted ${
                showLogin ? 'tab-active' : ''
              }`}
            >
              Login
            </div>
            <div
              onClick={() => {
                setShowLogin(false)
              }}
              className={`tab tab-lg tab-lifted ${
                showLogin ? '' : 'tab-active'
              }`}
            >
              Register
            </div>
          </div>
          {showLogin ? <h1>Login</h1> : <h1>Register</h1>}
        </header>
        <div className="content px-8">
          {showLogin ? (
            <Login toggleModal={toggleModal} setConnected={setConnected} />
          ) : (
            <Register setShowLogin={setShowLogin} />
          )}
        </div>
      </div>
    </div>
  )
}
