import axios from 'axios'
import { Playlists, MusicDetail } from 'models'
import { useEffect, useState } from 'react'
import 'styles/data/Banner.scss'

const NumberWords = ['one', 'two', 'three']

export const Banner = () => {
  const DWAVES_USER_ID = 10
  const TIMER = 4000

  let timer: NodeJS.Timer
  const [playlists, setPlaylists] = useState<Playlists[]>([])
  const [activePlaylist, setActivePlaylist] = useState<Playlists>()
  const [indexPlaylist, setIndexPlaylist] = useState(0)

  const getPlaylists = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists`,
        {
          withCredentials: true,
          params: {
            creatorId: DWAVES_USER_ID,
          },
        },
      )
      setPlaylists(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getPlaylists()
  }, [])

  useEffect(() => {
    if (!timer) {
      timer = setInterval(() => {
        setIndexPlaylist((indexPlaylist) => ++indexPlaylist)
      }, TIMER)
    }

    setActivePlaylist(playlists[indexPlaylist])

    if (indexPlaylist === playlists.length - 1) {
      clearInterval(timer)
      setTimeout(() => {
        setIndexPlaylist(0)
      }, TIMER)
    }

    return () => clearInterval(timer)
  }, [playlists, indexPlaylist])

  return (
    <>
      {activePlaylist && (
        <section className="contain-banner">
          <div
            className="background-image"
            style={{
              backgroundImage: `url(${
                import.meta.env.VITE_PINATA_GATEWAY_HOST
              }/${activePlaylist.coverCID})`,
            }}
          />
          <div className="background-blur" />
          <div className="content-playlist">
            <div className="left">
              <h1>{activePlaylist.name}</h1>
              <br />
              <p>
                {activePlaylist.description
                  ? activePlaylist.description
                  : 'Pas de description pour cette playlist'}
              </p>
            </div>
            <div className="right">
              {activePlaylist.musics.map(
                (music, i) =>
                  i < 3 && (
                    <img
                        key={i}
                      alt=""
                      className={`img ${NumberWords[i]}`}
                      src={`${music.albumCover}`}
                    />
                  ),
              )}
            </div>
          </div>
          <div className="banner-pagination">
            <div
              style={{
                width: `${100 / playlists.length}%`,
                marginLeft: `${(100 / playlists.length) * indexPlaylist}%`,
              }}
              className="step"
            />
          </div>
        </section>
      )}
    </>
  )
}
