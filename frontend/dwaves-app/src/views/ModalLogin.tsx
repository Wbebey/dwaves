import 'styles/Login.scss'
import { Login, Register } from 'components'
import { responseRequest } from 'models'
import { useState } from 'react'

interface Props {
  toggleModal: () => void
  setConnected: React.Dispatch<React.SetStateAction<boolean>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const ModalLogin: React.FC<Props> = ({ toggleModal, setConnected, setAlert }) => {
  const [showLogin, setShowLogin] = useState(true)

  return (
    <div onClick={toggleModal} id="contain-modal">
      <div onClick={(e) => e.stopPropagation()} id="modal" className='grid grid-rows-[1fr_2fr] h-[80%]'>
        <header className='gap-4'>
          <img src="/logo-dwaves.png" alt="" />
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
        <div className="self-start px-8">
          {showLogin ? (
            <Login setAlert={setAlert} toggleModal={toggleModal} setConnected={setConnected} />
          ) : (
            <Register setAlert={setAlert} setShowLogin={setShowLogin} />
          )}
        </div>
      </div>
    </div>
  )
}
