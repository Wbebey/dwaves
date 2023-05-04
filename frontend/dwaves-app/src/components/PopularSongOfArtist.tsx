import {useEffect, useState} from "react";
import axios from "axios";

type MostPopularSong = {
    name: string
    type: string
    listenings: number
    src: string
    artist: string
    genre: string
    albumName: string
    albumCover: string
    albumDate: Date
}

export const PopularSongOfArtist = () => {


    const [mostPopularSong, setMostPopularSong] = useState<MostPopularSong[]>([])

    const getMostPopularSong = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACK_URL}/musics/popular?artistId=4&limit=10`,
                {
                    withCredentials: true,
                }
            )
            console.log(res.data)
            setMostPopularSong(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMostPopularSong()
    }, [])

    function convertDateToYearUTC(dateStr: Date) {
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        return year.toString();
    }

    return (
        <div className={'h-[90%] pt-[30px] pl-[20px]'}>
            <h1 className={'text-4xl font-bold mb-5'}>My Popular Song</h1>
            <div className={`w-full h-[90%] overflow-scroll`}>
                {
                    mostPopularSong.map((song, index) => (
                        <>
                            <div key={index} className={'flex flex-row mb-5'}>
                                <div className={'text-2xl align-baseline flex self-center pr-2 w-24'}>{index + 1}</div>
                                <div className={'flex justify-between  items-center w-full'}>
                                    <div className={'w-16'}>
                                        <img src={song?.albumCover} alt=""/>
                                    </div>
                                    <div>
                                        <div className={'text-center'}>{song.name}</div>
                                        <div>{song.albumName}</div>
                                    </div>
                                    <div>
                                        <div className={'text-end'}>{song.listenings} listenings</div>
                                        <div className={'text-end'}>{convertDateToYearUTC(song.albumDate)}</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ))
                }
            </div>
        </div>
    )

}