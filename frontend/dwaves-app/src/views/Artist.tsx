import React, { Dispatch, RefObject, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/shared'
import {
  AlbumDetail,
  CurrentUser,
  MostPopularSong,
  responseRequest,
} from '../models'
import axios from 'axios'
import { AlbumOfArtist, ArtistPopularSong } from '../components'
import { is } from '@react-three/fiber/dist/declarations/src/core/utils'

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
  audioElmt: RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: Dispatch<React.SetStateAction<boolean>>
  setAlbum: Dispatch<React.SetStateAction<AlbumDetail | undefined>>
}

export const Artist: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  setAlert,
  audioElmt,
  isPlaying,
  setIsPlaying,
  setAlbum,
}) => {
  const { id } = useParams()

  const [artist, setArtist] = useState<CurrentUser>()

  const [mostPopularSong, setMostPopularSong] = useState<MostPopularSong[]>([])

  const getMostPopularSong = async (userId: number) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_APP_BACK_URL
        }/musics/popular?artistId=${userId}&limit=10`,
        {
          withCredentials: true,
        },
      )

      const musicsWithDuration = res.data.map((artistMusic: any) => {
        const artistAudio = new Audio(artistMusic.src)
        let formattedDuration: string = ''
        const promise = new Promise<void>((resolve) => {
          artistAudio.addEventListener('loadedmetadata', () => {
            const artistDuration = artistAudio.duration
            const artistMinutes = Math.floor(artistDuration / 60)
            const artistSeconds = Math.floor(artistDuration % 60)
            formattedDuration = `${artistMinutes} : ${
              artistSeconds < 10 ? '0' : ''
            }${artistSeconds}`
            resolve()
          })
        })
        return promise.then(() => ({
          ...artistMusic,
          duration: formattedDuration,
        }))
      })
      Promise.all(musicsWithDuration)
        .then((result) => {
          setMostPopularSong([...result])
        })
        .catch((r) => console.log(r))
      setMostPopularSong(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getArtistDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/${id}`,
        {
          withCredentials: true,
        },
      )
      setArtist(res.data)
      await getMostPopularSong(res.data.id)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getArtistDetails(id!)
      .then((r) => console.log(r))
      .catch((r) => console.log(r))
  }, [])

  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      <header className="head flex items-center gap-3 p-4">
        <Link to={'/'}>
          <Icon icon="return" size="Large" />
        </Link>
        <div className="divider divider-horizontal mx-0" />
        <div className="avatar">
          <div className="w-14 h-14 rounded-full">
            <img
              src={artist?.avatar || 'https://placeimg.com/192/192/people'}
              alt=""
            />
          </div>
        </div>
        <h3 className="text-4xl font-bold">{artist?.username}</h3>
      </header>
      <div className={'h-[93%] pt-[30px] pl-[20px]'}>
        <div className={`w-full h-[99%] overflow-scroll`}>
          {artist && (
            <>
              <AlbumOfArtist artistId={artist.id} setAlert={setAlert} />
              <ArtistPopularSong
                artistId={artist.id}
                setSongs={setSongs}
                setCurrentSong={setCurrentSong}
                mostPopularSong={mostPopularSong}
                audioElmt={audioElmt}
                isPlaying={isPlaying}
                setAlbum={setAlbum}
                setIsPlaying={setIsPlaying}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
