import { PlayPause } from "songs/listenMusic";
import { AlbumDetail } from "../models";
import { Icon } from "./shared";

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
    return (
        <div className='container-list'>
            <ul className="list-song">
                {songs?.musics.map((music, i) => (
                    <li
                        onClick={e => {
                            setCurrentSong(music)
                            setSongs(songs.musics)
                            setArtist(songs)
                            PlayPause(audioElmt, isPlaying, setIsPlaying)
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
                            <Icon icon="add" />
                            <Icon icon="like" />
                            <p>2 : 30</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}