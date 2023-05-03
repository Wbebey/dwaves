import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/shared'
import { AlbumDetail, MostPopularSong, responseRequest } from '../models'
import axios from 'axios'
import { AlbumOfArtist, ArtistPopularSong } from '../components'

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Artist: React.FC<Props> = ({
  setCurrentSong,
  setSongs,
  setAlert,
}) => {
  const { id } = useParams()

  const [artist, setArtist] = useState({
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
      setArtist(selectedUser)
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
          <h3 className="text-4xl font-bold">{artist.username}</h3>
        </div>
      </header>
      <div className={'h-[93%] pt-[30px] pl-[20px]'}>
        <div className={`w-full h-[99%] overflow-scroll`}>
          {artist.id && (
            <>
              <AlbumOfArtist artistId={artist.id} setAlert={setAlert} />
              <ArtistPopularSong
                artistId={artist.id}
                setSongs={setSongs}
                setCurrentSong={setCurrentSong}
                mostPopularSong={mostPopularSong}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
