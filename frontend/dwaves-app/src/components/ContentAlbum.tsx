import 'styles/ContentAlbum.scss'
import { Icon } from 'components/shared'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

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
}

export const ContentAlbum: React.FC<Props> = ({ setCurrentSong, setSongs }) => {
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
      <ul className="list-song">
        {album?.musics.map((music, i) => (
          <li
            onClick={e => {
              setCurrentSong(music)
              setSongs(album)
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
              <p>{album.artist}</p>
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
