import "../styles/Login.scss"
import { useState } from "react"
import { Login } from "../components/Login"
import { Register } from "../components/Register"
interface Props {
    displayModal: (e: any) => void
}

export const ModalLogin: React.FC<Props> = ({ displayModal }) => {
    const [showLogin, setShowLogin] = useState(true)

    return (
        <div id='contain-modal'>
            <div id="modal">
                <header>
                    <img onClick={(e) => { displayModal(e) }} src={`${import.meta.env.VITE_APP_URL}logo-dwaves.png`} alt="" />
                    <div className="tabs">
                        <div onClick={() => { setShowLogin(true) }} className={`tab tab-lg tab-lifted ${showLogin ? 'tab-active' : ''}`}>Login</div>
                        <div onClick={() => { setShowLogin(false) }} className={`tab tab-lg tab-lifted ${showLogin ? '' : 'tab-active'}`}>Register</div>
                    </div>
                    {showLogin ?
                        <h1>
                            Login
                        </h1>
                        :
                        <h1>
                            Register
                        </h1>
                    }
                </header>
                <div className="content px-8">
                    {showLogin ?
                        <Login />
                        :
                        <Register />
                    }
                </div>
            </div>
        </div>
    )
}
