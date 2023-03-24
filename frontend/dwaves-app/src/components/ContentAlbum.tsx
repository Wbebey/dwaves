import 'styles/ContentAlbum.scss'
import { Icon } from 'components/shared'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { SongList } from "./SongList";

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
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  audioElmt: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ContentAlbum: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  audioElmt,
  isPlaying,
  setIsPlaying,
}) => {
  const { id } = useParams()

  const [album, setAlbum] = useState<AlbumDetail>()

  const getAlbumDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/albums/${id}`,
        {
          withCredentials: true,
        }
      )
      console.log(res.data)
      setAlbum(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (id) {
      getAlbumDetails(id)
    }
  }, [id])

  return (
    <div className="content-album">
      <header className="head">
        <Link to={'/'}>
          <Icon icon="return" size="Large" />
        </Link>
        <div className="divider divider-horizontal" />
        <div className="title">
          <img src={album?.cover} alt="" />
          <h3>{album?.name}</h3>
        </div>
        <div className="avatar">
          <div className="w-14 h-14 rounded-full">
            <img src="https://placeimg.com/192/192/people" alt="" />
          </div>
        </div>
      </header>
      <SongList
        songs={album!}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying} />
    </div>
  )
}
