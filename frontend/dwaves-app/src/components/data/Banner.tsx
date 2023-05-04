import axios from "axios";
import { Playlists, Test } from "models";
import { useEffect, useState } from "react";
import "styles/data/Banner.scss";

const NumberWords = [
  'one',
  'two',
  'three',
]

export const Banner = () => {
  const [playlists, setPlaylists] = useState<Playlists[]>([])
  const [playlist, setPlaylist] = useState<Playlists>()
  const [indexPlaylist, setIndexPlaylist] = useState(0)

  const getPlaylists = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists`,
        {
          withCredentials: true,
        }
      );
      setPlaylists(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getPlaylists()
  }, [])

  useEffect(() => {
    setPlaylist(playlists[indexPlaylist])
  }, [indexPlaylist])

  useEffect(() => {
    setInterval(() => {
      if (indexPlaylist === playlists.length - 1) {
        setIndexPlaylist(0)
      } else {
        setIndexPlaylist(indexPlaylist + 1)
      }
    }, 5000)
  }, [playlists])


  return (
    <>
      {
        playlists.length &&
        <section className="contain-banner">
          <div
            className="background-image"
            style={{
              backgroundImage: `url(${import.meta.env.VITE_PINATA_GATEWAY_HOST}/${playlists[indexPlaylist!].coverCID})`,
            }}
          />
          <div className="background-blur" />
          <div className="content-playlist">
            <div className="left">
              <h1>{playlists[indexPlaylist!].name}</h1>
              <br />
              <p>
                {
                  playlists[indexPlaylist!].description ?
                    playlists[indexPlaylist!].description
                    :
                    "Pas de description pour cette playlist"
                }
              </p>
            </div>
            <div className="right">
              {
                
                playlists[indexPlaylist!].musics.map((music , i) => (
                  (
                    i < 3 &&
                    <img
                      alt=""
                      className={`img ${NumberWords[i]}`}
                      src={`${music.albumCover}`}
                    />
                  )
                ))
              }
            </div>
          </div>
          <div className="banner-pagination">
            <div
              style={{ width: `${100 / playlists.length}%`, marginLeft: `${(100 / playlists.length) * indexPlaylist}%` }}
              className="step"
            />
          </div>
        </section>
      }
    </>
  );
};
