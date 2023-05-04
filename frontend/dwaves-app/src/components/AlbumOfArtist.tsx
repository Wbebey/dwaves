import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";


import {BsThreeDotsVertical} from "react-icons/bs";

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

export const AlbumOfArtist = () => {

    const [openDeleteOfAnAlbum, setOpenDeleteOfAnAlbum] = useState<number>(0)

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


    const showDeleteButton = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, albumId: number) => {
        e.preventDefault();

        console.log(openDeleteOfAnAlbum)

        if (openDeleteOfAnAlbum === 0) {
            setOpenDeleteOfAnAlbum(albumId)
        } else {
            setOpenDeleteOfAnAlbum(0)
        }
    }


    useEffect(() => {
        getMyAlbums()
    }, [])

    return (
        <div>
            <h1 className={'text-4xl pl-[5px] font-bold mb-5'}>My Albums</h1>
            <div className={'flex flex-row mb-11'}>
                {albums.map((album) => (
                    <div className="w-52 hover:bg-teal-300 p-4">
                        <Link
                            key={album.id}
                            to={`/album/${album.id}`}
                        >
                            <img src={album.cover} alt=""/>
                            <div className={'pt-2 pl-2 flex flex-row items-center justify-between'}>
                                <h3 className={'font-semibold text-l'}>{album.name}</h3>
                                <div className={'relative flex'}>
                                    <div className={'z-40 bg-amber-200'} onClick={e => showDeleteButton(e, album.id)}>
                                        <BsThreeDotsVertical/>
                                    </div>
                                    {openDeleteOfAnAlbum === album.id &&
                                        <div className='absolute text-center text-red-500 pt-5 bg-amber-500'>
                                            <p className='bg-gray-100 p-1 rounded-lg w-16'>Delete !</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )

}