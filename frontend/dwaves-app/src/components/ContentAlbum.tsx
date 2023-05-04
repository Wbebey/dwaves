import 'styles/ContentAlbum.scss'
import { Icon } from 'components/shared'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState, Dispatch, RefObject } from 'react'
import axios from 'axios'
import { SongList } from './SongList'
import { AlbumDetail, responseRequest } from 'models'

interface Props {
  setCurrentSong: Dispatch<React.SetStateAction<any>>
  setSongs: Dispatch<React.SetStateAction<any>>
  audioElmt: RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>
  setArtist: Dispatch<React.SetStateAction<AlbumDetail | undefined>>
  setAlert: Dispatch<React.SetStateAction<responseRequest | undefined>>
  likedMusics: string[]
  likeOrDislikeMusic: (music: string) => void
}

export const ContentAlbum: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  audioElmt,
  isPlaying,
  setIsPlaying,
  setArtist,
  setAlert,
  likedMusics,
  likeOrDislikeMusic,
}) => {
  const { id } = useParams()

  const [album, setAlbum] = useState<AlbumDetail>()

  const getAlbumDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/albums/${id}`,
        {
          withCredentials: true,
        },
      )
      const musicsWithDuration = res.data.musics.map((music: any) => {
        const audio = new Audio(music.src)
        let formattedDuration: string = ''
        const promise = new Promise<void>((resolve) => {
          audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration
            const minutes = Math.floor(duration / 60)
            const seconds = Math.floor(duration % 60)
            formattedDuration = `${minutes} : ${
              seconds < 10 ? '0' : ''
            }${seconds}`
            resolve()
          })
        })
        return promise.then(() => ({ ...music, duration: formattedDuration }))
      })

      Promise.all(musicsWithDuration).then((result) => {
        setAlbum({ ...res.data, musics: result })
      })
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
        setIsPlaying={setIsPlaying}
        setArtist={setArtist}
        setAlert={setAlert}
        likedMusics={likedMusics}
        likeOrDislikeMusic={likeOrDislikeMusic}
      />
    </div>
  )
}
