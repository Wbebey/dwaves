import {PlayPause} from "songs/listenMusic";
import {AlbumDetail, responseRequest, Playlists} from "../models";
import {Icon} from "./shared";
import {useEffect, useState} from "react";
import axios from "axios";
import {IoAdd} from "react-icons/all";
import {BsThreeDotsVertical} from "react-icons/bs";

interface Props {
    songs: AlbumDetail
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
    audioElmt: React.RefObject<HTMLAudioElement>
    isPlaying: boolean
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
    setArtist: React.Dispatch<React.SetStateAction<AlbumDetail | undefined>>
    isPlaylistSong?: boolean
    deleteMusicToThePlaylist?: any
    setAlert?: React.Dispatch<React.SetStateAction<responseRequest | undefined>>;
}


export const SongList: React.FC<Props> = ({
                                              songs,
                                              setCurrentSong,
                                              setSongs,
                                              audioElmt,
                                              isPlaying,
                                              setIsPlaying,
                                              setArtist,
                                              isPlaylistSong,
                                              deleteMusicToThePlaylist,
                                              setAlert
                                          }) => {

    const [allPlaylists, setAllPlaylists] = useState<Playlists>([])
    const [likedMusics, setLikedMusics] = useState<string[]>([])

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

    const getLikedMusics = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_BACK_URL}/users/me`,
                {
                    withCredentials: true,
                }
            )
            setLikedMusics(res.data.myLikedMusics)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAllPlaylistsOfTheUser();
        getLikedMusics();
    }, [])

    const displayAlert = (msg: string, status: number) => {
        setAlert!({response: msg, status: status, visible: true})
        setTimeout(() => {
            setAlert!({response: "", status: 0, visible: false})
        }, 3000)
    }

    const foundCidMusic = (musicUrl: string) => {
        const musicCIDArray = musicUrl.split("/")
        return musicCIDArray[musicCIDArray.length - 1]
    }

    const isLikedMusics = (music: string) => {
        const musicCID = foundCidMusic(music)

        return likedMusics.includes(musicCID);
    }

    const updateLikedMusics = async (musics: string[]) => {
        try {
            const data = {musics: musics}
            const res = await axios.put(`${import.meta.env.VITE_APP_BACK_URL}/users/me/updateLikedMusics`, data, {
                    withCredentials: true,
                }
            )
            // console.log(res.status)
        } catch (err) {
            console.log(err)
        }
    }

    const likeOrDislikeMusic = (music: string) => {
        const musicCID = foundCidMusic(music)
        const listOfLickedMusics = [...likedMusics]

        if (likedMusics.includes(musicCID)) {
            const updatedLikedMusics = listOfLickedMusics.filter(element => element !== musicCID);
            setLikedMusics(updatedLikedMusics)
            updateLikedMusics(updatedLikedMusics)
        } else {
            listOfLickedMusics.push(musicCID)
            setLikedMusics(listOfLickedMusics)
            updateLikedMusics(listOfLickedMusics)
        }
    }

    return (
        <div className='container-list'>
            <ul className="list-song">
                {songs?.musics.map((music, i) => (
                    <div key={i} className="flex flex-row hover:bg-teal-300">
                        <li
                            onClick={e => {
                                setCurrentSong(music)
                                setSongs(songs.musics)
                                setArtist(songs)
                                if (isPlaying) {
                                    setTimeout(() => {
                                        PlayPause(audioElmt, false, setIsPlaying)
                                    }, 1000)
                                } else {
                                    PlayPause(audioElmt, isPlaying, setIsPlaying)
                                }
                            }}
                            className="song-li cursor-pointer"
                        >
                            <div className="avatar placeholder">
                                <div className="text-neutral-content rounded-full w-10">
                                    <span className="text-xl">0{i + 1}</span>
                                </div>
                            </div>
                            <div className="p-0 divider divider-horizontal"/>
                            <div className="song-li-info">
                                <h4 style={{}}>{music.name}</h4>
                                <p>{songs.artist}</p>
                            </div>
                        </li>
                        <div className="song-li-action w-56 flex flex-row items-end pb-5">
                            <div>
                                {isPlaylistSong ?
                                    <div className="dropdown dropdown-left bg-transparent">
                                        <div tabIndex={0}>
                                            <BsThreeDotsVertical/>
                                        </div>
                                        <div tabIndex={0}
                                             className="dropdown-content menu p-2 shadow bg-base-100 w-28 rounded-box hover:bg-white">
                                            <button onClick={() => deleteMusicToThePlaylist(music.src!)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div className="dropdown dropdown-end">
                                            <div tabIndex={0} className="pt-2 rounded-lg cursor-pointer">
                                                <IoAdd/>
                                            </div>
                                            <ul tabIndex={0}
                                                className="dropdown-content p-2 shadow bg-base-100 rounded-box w-52 hover:bg-white items-center">
                                                {allPlaylists.map((thePlaylist, i) => (
                                                    <button key={i} className="hover:bg-white self-center"
                                                            onClick={() => addSongToThePlaylist(thePlaylist.id, music.src!)}
                                                    >
                                                        {thePlaylist.name}
                                                    </button>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                }
                            </div>
                            <button className="pl-5" onClick={() => likeOrDislikeMusic(music.src!)}>
                                <Icon icon="like" color={isLikedMusics(music.src!) ? "red" : "black"}
                                      variant={isLikedMusics(music.src!) ? "Bold" : "Linear"}/>
                            </button>
                            <p className="pt-4 pl-5">2 : 30</p>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    )
}