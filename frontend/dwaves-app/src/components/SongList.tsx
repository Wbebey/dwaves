import { PlayPause } from "songs/listenMusic";
import { AlbumDetail } from "../models";
import { Icon } from "./shared";
import {useEffect, useState} from "react";

interface Props {
    songs: AlbumDetail
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
    audioElmt: React.RefObject<HTMLAudioElement>
    isPlaying: boolean
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    setArtist : React.Dispatch<React.SetStateAction<AlbumDetail|undefined>>;
}

export const SongList: React.FC<Props> = ({
    songs,
    setCurrentSong,
    setSongs,
    audioElmt,
    isPlaying,
    setIsPlaying,
    setArtist
}) => {

    const [allPlaylists, setAllPlaylists] = useState<Playlists>([])

    useEffect(() => {
        getAllPlaylistsOfTheUser();

    }, [])

    const getAllPlaylistsOfTheUser = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACK_URL}/users/me/playlists`, {
                    withCredentials: true,
                }
            )
            setAllPlaylists(res.data)
        } catch (err) {
            console.log(err)
        }
    }

    const getALlMusicsCidOfAPlaylist = async (playlistId: number) => {
        const musicsCid: string[] = []
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlistId}`, {
                    withCredentials: true,
                }
            )

            res.data.musics.forEach((music: any) => {
                const musicUrl = music.src.split('/')
                musicsCid.push(musicUrl[musicUrl.length - 1])
            })
            return musicsCid
        } catch (err) {
            console.log(err)
        }
    }

    const addSongToThePlaylist = async (playlistId: number, musicSrc: string) => {
        let musicsCid: string[] | undefined = []
        try {
            musicsCid = await getALlMusicsCidOfAPlaylist(playlistId)
            const newMusicUrl = musicSrc.split('/')
            musicsCid!.push(newMusicUrl[newMusicUrl.length - 1])

            const data = {musics: musicsCid}
            const res = await axios.put(`${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlistId}`, data, {
                    withCredentials: true,
                }
            )
            if (Array.isArray(res.data)) {
                displayAlert(res.data[0].msg, res.status)
            } else {
                displayAlert('Music added successfully to the playlist', res.status)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const displayAlert = (msg: string, status: number) => {
        setAlert({response: msg, status: status, visible: true})
        setTimeout(() => {
            setAlert({response: "", status: 0, visible: false})
        }, 3000)
    }
    return (
        <div className='container-list'>
            <ul className="list-song">
                {songs?.musics.map((music, i) => (
                    <li
                        onClick={e => {
                            setCurrentSong(music)
                            setSongs(songs.musics)
                            setArtist(songs)
                            if (isPlaying) {
                                setTimeout(()=>{
                                    PlayPause(audioElmt, false, setIsPlaying)
                                },1000)
                            } else {
                                PlayPause(audioElmt, isPlaying, setIsPlaying)
                            }
                        }}
                        key={i}
                        className="song-li cursor-pointer"
                    >
                        <div className="avatar placeholder">
                            <div className="text-neutral-content rounded-full w-10">
                                <span className="text-xl">0{i + 1}</span>
                            </div>
                        </div>
                        <div className="p-0 divider divider-horizontal" />
                        <div className="song-li-info">
                            <h4 style={{}}>{music.name}</h4>
                            <p>{songs.artist}</p>
                        </div>
                        <div className="song-li-action">
                            <div className="dropdown dropdown-end bg-transparent">
                                <div tabIndex={0} className="btn m-1 bg-white hover:bg-white"><Icon icon="add"/></div>
                                <ul tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 hover:bg-white">
                                    {allPlaylists.map((thePlaylist, i) => (
                                        <button key={i} className="hover:bg-white self-center"
                                                onClick={() => addSongToThePlaylist(thePlaylist.id, music.src!)}
                                        >
                                            {thePlaylist.name}
                                        </button>
                                    ))}
                                </ul>
                            </div>


                            <button onClick={() => console.log('hey')}>
                                <Icon icon="like"/>
                            </button>
                            <p className="pt-4">2 : 30</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}