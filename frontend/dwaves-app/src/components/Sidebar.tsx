// Those will need to be replaced by buttons directly
import axios from "axios";
import { AddCircle, Home2, MusicFilter, Setting2, User, Logout } from "iconsax-react";
import { Link } from "react-router-dom";

import datasongs from "songs/datasongs";

import { ConnectMetamask } from "./ConnectionMetamask"

interface Props {
    displayModal: (e: any) => void;
    connected: boolean;
    setConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

const disconect = () => {
    axios.post(`${import.meta.env.VITE_APP_BACK_URL}/auth/logout`, {} , {withCredentials: true})
        .then(res => {
            window.location.reload()
        })
        .catch(err => {console.log(err)})
}

export const Sidebar: React.FC<Props> = ({ displayModal, connected, setConnected }) => {
    return (
        <aside className="sidebar">
            <ul style={{ height: '100%' }} className="menu bg-white p-2">
                <li>
                    {connected ?
                        <Link to={"/profil"} className="py-0">
                            <div className="avatar mx-auto">
                                <div className="w-12 rounded-full">
                                    <img src="https://placeimg.com/192/192/people" alt='' />
                                </div>
                            </div>
                            <p>
                                Item
                            </p>
                        </Link>
                        :
                        <div onClick={(e) => { displayModal(e) }} className="h-10 py-0">
                            <User className='mx-auto' />
                        </div>
                    }
                </li>
                <div className="divider m-0" />
                {
                    connected ?
                        <ConnectMetamask />
                        :
                        <div />
                }
                <li>
                    <Link to={"/"}>
                        <Home2 className="w-10 h-10 mx-auto" />
                        <p>
                            Item
                        </p>
                    </Link>
                </li>
                <li>
                    <div>
                        <MusicFilter className="w-10 h-10" />
                    </div>
                </li>
                {connected ?
                    <li>
                        <Link to={"/download"}>
                            <AddCircle className="w-10 h-10 mx-auto" />
                            <p>
                                Item
                            </p>
                        </Link>
                    </li>
                    :
                    <div />
                }
                <div className="divider m-0" />
                {datasongs.map(song =>
                    <li key={song.Title}>
                        <Link to={"/album"}>
                            <div className="avatar mx-auto">
                                <div className="w-12 rounded">
                                    <img src={`${import.meta.env.VITE_APP_URL}/stamina1.jpg`} alt='' />
                                </div>
                            </div>
                            <p>
                                Item
                            </p>
                        </Link>
                    </li>
                )}
                <li style={connected ? { position: 'absolute', bottom: '11%'} : { position: 'absolute', bottom: '4%' }}>
                    <div>
                        <Setting2 className="w-10 h-10" />
                    </div>
                </li>
                {connected ?
                    <li onClick={disconect} style={{ position: 'absolute', bottom: '4%' }}>
                        <div>
                            <Logout color="red" className="w-10 h-10" />
                        </div>
                    </li>
                    :
                    <div />
                }
            </ul>

        </aside>
    )
}
