import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


import {BsThreeDotsVertical} from "react-icons/bs";
import {responseRequest} from "../models";

type Album = {
    id: number
    type: string
    name: string
    createdAt: Date
    genre: string
    artist: string
    subscribers: number
    cover: string
}

interface Props {
    setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const AlbumOfArtist: React.FC<Props> = ({setAlert}) => {
    const [albums, setAlbums] = useState<Album[]>([])

    const getMyAlbums = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACK_URL}/users/me/albums`,
                {
                    withCredentials: true,
                }
            )
            setAlbums(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteAlbum = async (albumId: number) => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_APP_BACK_URL}/albums/${albumId}`,
                {
                    withCredentials: true,
                }
            )
            if (Array.isArray(res.data)) {
                displayAlert(res.data[0].msg, res.status)
            } else {
                displayAlert('Album deleted successfully', res.status)
            }
        } catch (err) {
            console.log(err)
        }

        getMyAlbums()
    }

    const displayAlert = (msg: string, status: number) => {
        setAlert({response: msg, status: status, visible: true})
        setTimeout(() => {
            setAlert({response: "", status: 0, visible: false})
        }, 3000)
    }

    useEffect(() => {
        getMyAlbums()
    }, [])

    return (
        <div>
            <h1 className={'text-4xl pl-[5px] font-bold mb-5'}>My Albums</h1>
            <div className={'flex flex-row mb-11'}>
                {albums.map((album) => (
                    <div key={album.id} className="w-52 hover:bg-teal-300 p-4">
                        <Link
                            key={album.id}
                            to={`/album/${album.id}`}
                        >
                            <img src={album.cover} alt=""/>
                        </Link>
                        <div className={'pt-2 pl-2 flex flex-row items-center justify-between'}>
                            <h3 className={'font-semibold text-l'}>{album.name}</h3>
                            <div className={'relative flex dropdown dropdown-end'}>
                                <div tabIndex={0}>
                                    <BsThreeDotsVertical/>
                                </div>
                                <ul tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-28 hover:bg-white">
                                    <button className="hover:bg-white self-center"
                                            onClick={() => deleteAlbum(album.id)}>
                                        Delete !
                                    </button>
                                </ul>
                                {/*{openDeleteOfAnAlbum === album.id &&*/}
                                {/*    <div className='absolute text-center text-red-500 pt-5'>*/}
                                {/*        <div className='bg-gray-100 p-1 rounded-lg w-16'*/}
                                {/*             onClick={e => {*/}
                                {/*                 deleteAlbum(e, album.id)*/}
                                {/*             }}*/}
                                {/*        >*/}
                                {/*            <p>Delete !</p>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*}*/}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    )
}

