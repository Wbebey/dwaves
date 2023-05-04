// Those will need to be replaced by buttons directly
import axios from 'axios'
import {
  AddCircle,
  Home2,
  MusicFilter,
  Setting2,
  User,
  Logout,
  BitcoinConvert,
} from 'iconsax-react'
import { Link } from 'react-router-dom'

import datasongs from 'songs/datasongs'

import { ConnectMetamask } from './ConnectionMetamask'

interface Props {
  toggleModal: () => void
  connected: boolean
  wallet: string
  setConnected: React.Dispatch<React.SetStateAction<boolean>>
  requestConnectionMetamask: () => Promise<void>
}

export const Sidebar: React.FC<Props> = ({
  toggleModal,
  connected,
  wallet,
  requestConnectionMetamask,
  setConnected,
}) => {
  const disconect = () => {
    axios
      .post(
        `${import.meta.env.VITE_APP_BACK_URL}/auth/logout`,
        {},
        { withCredentials: true },
      )
      .then((res) => {
        setConnected(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <aside className="sidebar">
      <ul
        style={{ height: '100%', position: 'relative' }}
        className="menu bg-white p-2"
      >
        <li>
          {connected ? (
            <Link to={'/profile'} className="py-0">
              <div className="avatar mx-auto">
                <div className="w-12 rounded-full">
                  <img src="https://placeimg.com/192/192/people" alt="" />
                </div>
              </div>
              <p>Item</p>
            </Link>
          ) : (
            <div onClick={toggleModal} className="h-10 py-0">
              <User className="mx-auto" />
            </div>
          )}
        </li>
        <div className="divider m-0" />
        {connected ? (
          <ConnectMetamask
            wallet={wallet}
            requestConnectionMetamask={requestConnectionMetamask}
          />
        ) : (
          <div />
        )}
        <li>
          <Link to={'/'}>
            <Home2 className="w-10 h-10 mx-auto" />
            <p>Item</p>
          </Link>
        </li>
        <li>
          <Link to={'/playlist'}>
            <MusicFilter className="w-10 h-10 mx-auto" />
          </Link>
        </li>
        {connected ? (
          <>
            <li>
              <Link to={'/marketplace'}>
                <BitcoinConvert className="w-10 h-10 mx-auto" />
                <p>Item</p>
              </Link>
            </li>
            <li>
              <Link to={'/download'}>
                <AddCircle className="w-10 h-10 mx-auto" />
                <p>Item</p>
              </Link>
            </li>
          </>
        ) : (
          <div />
        )}
        <div className="divider m-0" />
        <li
          style={
            connected
              ? { position: 'absolute', bottom: '10%' }
              : { position: 'absolute', bottom: '1%' }
          }
        >
          <div>
            <Setting2 className="w-10 h-10" />
          </div>
        </li>
        {connected ? (
          <li
            onClick={disconect}
            style={{ position: 'absolute', bottom: '1%' }}
          >
            <div>
              <Logout color="red" className="w-10 h-10" />
            </div>
          </li>
        ) : (
          <div />
        )}
      </ul>
    </aside>
  )
}
