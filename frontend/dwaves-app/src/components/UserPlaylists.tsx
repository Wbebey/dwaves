import {Link} from "react-router-dom";
import {BsThreeDotsVertical} from "react-icons/bs";
import React, {useEffect, useState, useSyncExternalStore} from "react";
import axios from "axios";
import {Icon} from "./shared";
import {responseRequest} from "../models";


interface Props {
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const UserPlaylists: React.FC<Props> = ({setAlert}) => {

    const [playlists, setPlaylists] = useState<any>([])

    useEffect(() => {
        getPlaylists()
    }, [])

    const getPlaylists = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACK_URL}/users/me/playlists`,
                {
                    withCredentials: true,
                }
            )
            setPlaylists(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePlaylist = async (playlistId: number) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlistId}`,
                {
                    withCredentials: true,
                }
            )
            getPlaylists()
            if (Array.isArray(res.data)) {
                displayAlert(res.data[0].msg, res.status)
            } else {
                displayAlert('Playlist deleted successfully', res.status)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const displayAlert = (msg: string, status: number) => {
        setAlert({response: msg, status: status, visible: true})
        setTimeout(() => {
            setAlert({response: "", status: 0, visible: false})
        }, 3000)
    }

    return (
        <div>
            <h1 className={'text-4xl pl-[5px] font-bold mb-5'}>My Playlists</h1>
            <div className={'flex flex-row mb-11 flex-wrap'}>
                <div className="w-52 hover:bg-teal-300 p-4">
                    <Link to={`/playlist/likedMusicsPlaylist`}>
                        <img src="/playlistLiked.webp" alt=""/>
                        <div className={'pt-2 pl-2 flex'}>
                            <h3 className={'font-semibold text-l w-full text-center'}>My liked musics</h3>
                        </div>
                    </Link>
                </div>
                {playlists.map((playlist: any) => (
                    <div key={playlist.id} className="w-52 hover:bg-teal-300 p-4">
                        <Link to={`/playlist/${playlist.id}`}>
                            <img src={`${import.meta.env.VITE_PINATA_GATEWAY_HOST}/${playlist.coverCID}`} alt=""/>
                            <div className={'pt-2 pl-2 flex flex-row items-center justify-between'}>
                                <h3 className={'font-semibold text-l'}>{playlist.name}</h3>
                                <div onClick={(e) => e.preventDefault()}
                                     className="dropdown bg-transparent">
                                    <div tabIndex={0}>
                                        <BsThreeDotsVertical/>
                                    </div>
                                    <div tabIndex={0}
                                         className="dropdown-content menu p-2 shadow bg-base-100 w-28 rounded-box hover:bg-white">
                                        <button onClick={e => deletePlaylist(playlist.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}