import 'styles/ContentAlbum.scss'
import { Icon } from 'components/shared'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState, Dispatch, RefObject } from 'react'
import axios from 'axios'
import { SongList } from './SongList'
import { AlbumDetail, CurrentUser, responseRequest } from 'models'

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
  const [avatar, setAvatar] = useState('')
  const [artistId, setArtistId] = useState(0)

  const getAlbumDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/albums/${id}`,
        {
          withCredentials: true,
        },
      )

      const resUser = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/${res.data.artistId}`,
        {
          withCredentials: true,
        },
      )

      setAvatar(resUser.data.avatar)
      setArtistId(resUser.data.id)

      const musicsWithDuration = res.data.musics.map((newMusic: any) => {
        const newAudio = new Audio(newMusic.src)
        let formattedDuration: string = ''
        const promise = new Promise<void>((resolve) => {
          newAudio.addEventListener('loadedmetadata', () => {
            const newDuration = newAudio.duration
            const newMinutes = Math.floor(newDuration / 60)
            const newSeconds = Math.floor(newDuration % 60)
            formattedDuration = `${newMinutes} : ${
              newSeconds < 10 ? '0' : ''
            }${newSeconds}`
            resolve()
          })
        })
        return promise.then(() => ({
          ...newMusic,
          duration: formattedDuration,
        }))
      })

      Promise.all(musicsWithDuration)
        .then((result) => {
          setAlbum({ ...res.data, musics: result })
        })
        .catch((r) => console.log(r))
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
        <Link to={`/artist/${artistId}`}>
          <div className="avatar">
            <div className="w-14 h-14 rounded-full">
              <img
                src={avatar || 'https://placeimg.com/192/192/people'}
                alt=""
              />
            </div>
          </div>
        </Link>
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
