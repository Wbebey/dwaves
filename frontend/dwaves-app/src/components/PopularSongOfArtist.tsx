import {useEffect, useState} from "react";
import axios from "axios";

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



export const PopularSongOfArtist = () => {

    const [mostPopularSongs, setMostPopularSongs] = useState<Album[]>()
    const [mostPopularSongsWithAlbum, setMostPopularSongsWithAlbum] = useState()

    const getMostPopularSongs = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACK_URL}/musics/popular?artistId=4&limit=11`,
                {
                    withCredentials: true,
                }
            )
            console.log(res.data)
            setMostPopularSongs(res.data)


        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        getMostPopularSongs()
        //fetchAlbumOfMostPopularSong()
    }, [])


    return (
        <div> Player profile </div>
    )

}