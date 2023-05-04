import {responseRequest} from "../models";
import {Icon} from "./shared";

type Music = {
    src: string
    name: string
    listenings: number
}

type AlbumDetail = {
    id: number
    type: string
    name: string
    createdAt: Date
    genre: string
    artist: string
    subscribers: number
    cover: string
    musics: Music[]
}

interface Props {
    songs: AlbumDetail
    setCurrentSong: React.Dispatch<React.SetStateAction<any>>
    setSongs: React.Dispatch<React.SetStateAction<any>>
}

export const SongList: React.FC<Props> = ({songs, setCurrentSong, setSongs}) => {

    return (
        <div className='container-list'>
            <ul className="list-song">
                {songs?.musics.map((music, i) => (
                    <li
                        onClick={e => {
                            //console.log(music)
                            //console.log(songs)
                            setCurrentSong(music)
                            setSongs(songs)
                        }}
                        key={i}
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
                        <div className="song-li-action">
                            <Icon icon="add"/>
                            <Icon icon="like"/>
                            <p>2 : 30</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}