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

interface Props {
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
}

export const PopularSongOfArtist: React.FC<Props> = ({setCurrentSong, setSongs}) => {


    const [mostPopularSong, setMostPopularSong] = useState<MostPopularSong[]>([])

    const getMostPopularSong = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACK_URL}/users/me/popular?limit=10`,
                {
                    withCredentials: true,
                }
            )
            setMostPopularSong(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getMostPopularSong()
    }, [])


    function convertDateToYearUTC(dateStr: Date) {
        console.log(dateStr)
        const date = new Date(dateStr);
        const year = date.getUTCFullYear();
        return year.toString();
    }

    return (
        <div className={'h-[97%] pt-[30px] pl-[20px]'}>
            <div className={`w-full h-[90%] overflow-scroll`}>
                <h1 className={'text-4xl pl-[5px] font-bold mb-5'}>My Popular Song</h1>
                {
                    mostPopularSong.map((song, index) => (
                        <>
                            <div key={index} className={'flex flex-row mb-5 hover:bg-teal-300'}
                                 onClick={e => {
                                     //setCurrentSong(song)
                                     //setSongs(mostPopularSong)
                                 }}>
                                <div className={'text-2xl align-baseline flex self-center pl-2 w-24'}>{index + 1}</div>
                                <div className={'flex justify-between  items-center w-full'}>
                                    <div className={'w-16'}>
                                        <img src={song?.albumCover} alt=""/>
                                    </div>
                                    <div>
                                        <div className={'text-center'}>{song.name}</div>
                                        <div>{song.albumName}</div>
                                    </div>
                                    <div className={'pr-[50px]'}>
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