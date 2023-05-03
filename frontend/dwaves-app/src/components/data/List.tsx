import 'styles/data/List.scss'
import { Button, Icon } from 'components/shared'

import { Link } from 'react-router-dom'

import playlists from 'songs/playlist'
import { useEffect, useState } from 'react'
import axios from 'axios'

type Album = {
  id: number
  type: string
  name: string
  createdAt: Date
  genre: string
  artist: string
  subscribers: number
  cover: string
  artistId: number
}

export const List = () => {
  const [albums, setAlbums] = useState<Album[]>([])
  const getAlbums = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/albums`,
        {
          withCredentials: true,
        },
      )
      setAlbums(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAlbums()
  }, [])

  return (
    <section className="contain-list-view">
      <header className="m-4">
        {/* <div style={{ width: '60%' }} className="relative z-0">
          <input
            type="text"
            id="floating_standard"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_standard"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Floating standard
          </label>
        </div>
        <Icon icon="search" size="Large" />
        <div className="divider divider-horizontal" />
        <Button text="titres" size="Large" handleClick={() => {}} />
        <Button text="listes" size="Large" handleClick={() => {}} />
        <Button text="artistes" size="Large" handleClick={() => {}} /> */}
        <span className='font-bold text-4xl'>Featured albums</span>
      </header>
      <div className="content-playlist">
        <div className="body">
          {/* modify flex with action button */}
          <div className="row">
            <div className="overflow-x">
              <div className="contain-card">
                {albums.map((album) => (
                  <div key={album.id} className="card hover:bg-teal-300">
                    <Link to={`/album/${album.id}`}>
                      <img src={album.cover} alt="" />
                      <h3>{album.name.substring(0, 17 - 3)}...</h3>
                    </Link>
                    <Link
                      key={album.id}
                      to={`/artist/${album.artistId}`}
                      className="hover:underline underline-offset-2"
                    >
                      <p>{album.artist}</p>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
