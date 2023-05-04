import React, { Dispatch, RefObject, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/shared'
import { AlbumDetail, MostPopularSong, responseRequest } from '../models'
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
  setArtist: Dispatch<React.SetStateAction<AlbumDetail | undefined>>
}

export const Artist: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  setAlert,
  audioElmt,
  isPlaying,
  setIsPlaying,
  setArtist,
}) => {
  const { id } = useParams()

  const [selectedArtist, setSelectedArtist] = useState({
    id: 0,
    username: '',
  })

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
        `${import.meta.env.VITE_APP_BACK_URL}/users`,
        {
          withCredentials: true,
        },
      )
      const selectedUser = res.data.find(
        (user: { id: string }) => user.id.toString() === id,
      )
      setSelectedArtist(selectedUser)
      await getMostPopularSong(selectedUser.id)
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
      <header className="head flex flex-row">
        <Link to={'/'}>
          <Icon icon="return" size="Large" />
        </Link>
        <div className="divider divider-horizontal" />
        <div>
          {/*<img src={album?.cover} alt="" />*/}
          <h3 className="text-4xl font-bold">{selectedArtist.username}</h3>
        </div>
      </header>
      <div className={'h-[93%] pt-[30px] pl-[20px]'}>
        <div className={`w-full h-[99%] overflow-scroll`}>
          {selectedArtist.id && (
            <>
              <AlbumOfArtist artistId={selectedArtist.id} setAlert={setAlert} />
              <ArtistPopularSong
                artistId={selectedArtist.id}
                setSongs={setSongs}
                setCurrentSong={setCurrentSong}
                mostPopularSong={mostPopularSong}
                audioElmt={audioElmt}
                isPlaying={isPlaying}
                setArtist={setArtist}
                setIsPlaying={setIsPlaying}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
