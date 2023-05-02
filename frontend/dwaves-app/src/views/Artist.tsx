import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon } from '../components/shared'
import { AlbumDetail, responseRequest } from '../models'
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

  useEffect(() => {
    getArtistDetails(id!)
  }, [])

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
      console.log(selectedUser)
      // setArtist(res.data)
    } catch (error) {
      console.log(error)
    }
  }

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
      <div className={'h-[100%] pt-[30px] pl-[20px]'}>
        <div className={`w-full h-[90%] overflow-scroll`}>
          {artist.id && (
            <>
              <AlbumOfArtist artistId={artist.id} setAlert={setAlert} />
              <ArtistPopularSong
                artistId={artist.id}
                setSongs={setSongs}
                setCurrentSong={setCurrentSong}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
