import 'styles/ContentAlbum.scss'
import { Icon } from 'components/shared'
import { Link, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { SongList } from './SongList'
import { AlbumDetail, CurrentUser, responseRequest } from '../models'

interface Props {
  setCurrentSong: React.Dispatch<React.SetStateAction<any>>
  setSongs: React.Dispatch<React.SetStateAction<any>>
  audioElmt: React.RefObject<HTMLAudioElement>
  isPlaying: boolean
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>
  setArtist: React.Dispatch<React.SetStateAction<AlbumDetail | undefined>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
  likedMusics: string[]
  likeOrDislikeMusic: (music: string) => void
}

export const PlaylistContent: React.FC<Props> = ({
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

  const [playlist, setPlaylist] = useState<any>()
  const [isLikedMusicsPlaylist, setIsLikedMusicsPlaylist] =
    useState<boolean>(false)

  const getPlaylistDetails = async (id: string) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists/${id}`,
        {
          withCredentials: true,
        },
      )

      const resPlaylist = res.data

      const coverUrl = `${import.meta.env.VITE_PINATA_GATEWAY_HOST}/${
        res.data.coverCID
      }`
      const thePlaylist = { ...resPlaylist, cover: coverUrl, playlistId: id }

      const musicsWithDuration = thePlaylist.musics.map((music: any) => {
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

      Promise.all(musicsWithDuration)
        .then((result) => {
          setPlaylist({ ...thePlaylist, musics: result })
        })
        .catch((r) => console.log(r))
    } catch (error) {
      console.log(error)
    }
  }

  const deleteMusicToThePlaylist = async (musicSrc: string) => {
    let musicsCid: string[] | undefined = []
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlist.id}`,
        {
          withCredentials: true,
        },
      )

      res.data.musics.forEach((music: any) => {
        const musicUrl = music.src.split('/')
        musicsCid!.push(musicUrl[musicUrl.length - 1])
      })

      const newMusicUrl = musicSrc.split('/')
      const newMusicCid = newMusicUrl[newMusicUrl.length - 1]

      let index = musicsCid!.indexOf(newMusicCid)

      if (index !== -1) {
        musicsCid!.splice(index, 1)
      }

      const data = { musics: musicsCid }
      const res2 = await axios.put(
        `${import.meta.env.VITE_APP_BACK_URL}/playlists/${playlist.id}`,
        data,
        {
          withCredentials: true,
        },
      )

      if (id) {
        getPlaylistDetails(id)
          .then((r) => console.log(r))
          .catch((r) => console.log(r))
      }
      if (Array.isArray(res2.data)) {
        displayAlert(res2.data[0].msg, res2.status)
      } else {
        displayAlert(
          'Music deleted successfully from the playlist',
          res2.status,
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getLikedMusics = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me/likedMusics`,
        {
          withCredentials: true,
        },
      )
      const musicsWithDuration = res.data.map((likedMusic: any) => {
        const likedAudio = new Audio(likedMusic.src)
        let formattedDuration: string = ''
        const promise = new Promise<void>((resolve) => {
          likedAudio.addEventListener('loadedmetadata', () => {
            const likedDuration = likedAudio.duration
            const likedMinutes = Math.floor(likedDuration / 60)
            const likedSeconds = Math.floor(likedDuration % 60)
            formattedDuration = `${likedMinutes} : ${
              likedSeconds < 10 ? '0' : ''
            }${likedSeconds}`
            resolve()
          })
        })
        return promise.then(() => ({
          ...likedMusic,
          duration: formattedDuration,
        }))
      })

      Promise.all(musicsWithDuration)
        .then((result) => {
          setPlaylist({
            name: 'My liked musics',
            cover: '/playlistLiked.webp',
            musics: [...result],
          })
        })
        .catch((r) => console.log(r))
      setIsLikedMusicsPlaylist(true)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (id !== 'likedMusicsPlaylist') {
      getPlaylistDetails(id!)
        .then((r) => console.log(r))
        .catch((r) => console.log(r))
    } else {
      getLikedMusics()
        .then((r) => console.log(r))
        .catch((r) => console.log(r))
    }
  }, [id])

  const displayAlert = (msg: string, status: number) => {
    setAlert({ response: msg, status: status, visible: true })
    setTimeout(() => {
      setAlert({ response: '', status: 0, visible: false })
    }, 3000)
  }

  return (
    <div className="content-album">
      <header className="head">
        <Link to={'/playlist'}>
          <Icon icon="return" size="Large" />
        </Link>
        <div className="divider divider-horizontal" />
        <div className="title">
          {playlist && (
            <>
              <img src={playlist.cover} alt="" />
              <h3>{playlist?.name}</h3>
            </>
          )}
        </div>
      </header>
      {playlist?.description && (
        <p className="mx-20 mt-4 text-justify">{playlist.description}</p>
      )}
      <SongList
        songs={playlist}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        setArtist={setArtist}
        deleteMusicToThePlaylist={deleteMusicToThePlaylist}
        isPlaylistSong={true}
        isLikedPlaylist={isLikedMusicsPlaylist}
        setAlert={setAlert}
        likedMusics={likedMusics}
        likeOrDislikeMusic={likeOrDislikeMusic}
        setPlaylist={setPlaylist}
      />
    </div>
  )
}
