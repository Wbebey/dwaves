import './App.scss'

import {
  Player,
  Explorer,
  Album,
  Download,
  ModalLogin,
  Profile,
  PlaylistPage,
  Playlist,
} from 'views'
import { Loader, Sidebar, Alert, Footer } from 'components'
import { PlayerWrapper } from 'components/player'
import { Icon } from 'components/shared'

import { responseRequest, Music, AlbumDetail } from 'models'
import { playPause, playRandomSong } from 'songs/listenMusic'

import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'

function App() {
  const [loader, setLoader] = useState(true)
  const [artist, setArtist] = useState<AlbumDetail | undefined>()
  const [songs, setSongs] = useState<Music[] | undefined>()
  const [repeat, setRepeat] = useState(false)
  const [random, setRandom] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Music | undefined>()
  const [loginDisplay, setLoginDisplay] = useState(false)
  const [alert, setAlert] = useState<responseRequest>()
  const [connected, setConnected] = useState(false) // Temporary this value will be stored in the token
  const [likedMusics, setLikedMusics] = useState<string[]>([])
  const envName = import.meta.env.VITE_NODE_ENV
  const buildDate = import.meta.env.VITE_APP_BUILD_DATE
  const commitUrl = import.meta.env.VITE_APP_COMMIT_URL

  const audioElmt = useRef<HTMLAudioElement>(null) ?? someOtherData()

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 1000)

    if (isPlaying) {
      audioElmt.current?.play()
    } else {
      audioElmt.current?.pause()
    }
  }, [audioElmt, isPlaying])

  useEffect(() => {
    if (document.cookie.includes('loggedIn=true')) {
      setConnected(true)
    }
    getLikedMusics()
  }, [])

  const onPlaying = () => {
    const duration: number = audioElmt.current?.duration as number
    const ct: number = audioElmt.current?.currentTime as number

    console.log(duration, 'duration')
    if (songs) {
      setCurrentSong({
        ...currentSong!,
        progress: (ct / duration) * 100,
        length: duration,
      })
    }
    if (repeat) {
      if (currentSong?.progress! >= 99) {
        playPause(audioElmt, false, setIsPlaying)
      }
    }
    if (random) {
      if (currentSong?.progress! >= 99) {
        setCurrentSong(playRandomSong(songs!))
        setTimeout(() => {
          playPause(audioElmt, false, setIsPlaying)
        }, 1000)
      }
    }
  }

  const toggleModal = () => {
    setLoginDisplay(!loginDisplay)
  }

  const getLikedMusics = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me`,
        {
          withCredentials: true,
        },
      )
      setLikedMusics(res.data.myLikedMusics)
    } catch (error) {
      console.log(error)
    }
  }

  const foundCidMusic = (musicUrl: string) => {
    const musicCIDArray = musicUrl.split('/')
    return musicCIDArray[musicCIDArray.length - 1]
  }

  const updateLikedMusics = async (musics: string[]) => {
    try {
      const data = { musics: musics }
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me/updateLikedMusics`,
        data,
        {
          withCredentials: true,
        },
      )
      // console.log(res.status)
    } catch (err) {
      console.log(err)
    }
  }

  const likeOrDislikeMusic = (music: string) => {
    const musicCID = foundCidMusic(music)
    const listOfLickedMusics = [...likedMusics]

    if (likedMusics.includes(musicCID)) {
      const updatedLikedMusics = listOfLickedMusics.filter(
        (element) => element !== musicCID,
      )
      setLikedMusics(updatedLikedMusics)
      updateLikedMusics(updatedLikedMusics)
    } else {
      listOfLickedMusics.push(musicCID)
      setLikedMusics(listOfLickedMusics)
      updateLikedMusics(listOfLickedMusics)
    }
  }

  return loader ? (
    <Loader />
  ) : (
    <section style={{ color: 'black', height: window.innerHeight }}>
      {currentSong && (
        <audio src={currentSong.src} ref={audioElmt} onTimeUpdate={onPlaying} />
      )}
      <PlayerWrapper
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songs={songs}
        setSongs={setSongs}
        artist={artist}
        setRepeat={setRepeat}
        repeat={repeat}
        random={random}
        setRandom={setRandom}
        playRandomSong={playRandomSong}
        likedMusics={likedMusics}
        likeOrDislikeMusic={likeOrDislikeMusic}
        planeSubdivisions={8}
      />
      {alert?.visible && <Alert alert={alert} />}
      <section style={{ color: 'black', height: '75%' }}>
        <section className="container-app">
          <div className="contain-explorer">
            <Router>
              <Sidebar
                toggleModal={toggleModal}
                connected={connected}
                setConnected={setConnected}
              />
              {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Routes>
                <Route path="/" element={<Explorer />} />
                <Route
                  path="/album/:id"
                  element={
                    <Album
                      setCurrentSong={setCurrentSong}
                      setSongs={setSongs}
                      audioElmt={audioElmt}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      setArtist={setArtist}
                      setAlert={setAlert}
                      likedMusics={likedMusics}
                      likeOrDislikeMusic={likeOrDislikeMusic}
                    />
                  }
                />
                <Route
                  path="/playlist/:id"
                  element={
                    <Playlist
                      setCurrentSong={setCurrentSong}
                      setSongs={setSongs}
                      audioElmt={audioElmt}
                      isPlaying={isPlaying}
                      setIsPlaying={setIsPlaying}
                      setArtist={setArtist}
                      setAlert={setAlert}
                      likedMusics={likedMusics}
                      likeOrDislikeMusic={likeOrDislikeMusic}
                    />
                  }
                />
                <Route path="/player" element={<Player />} />
                <Route
                  path="/download"
                  element={<Download setAlert={setAlert} />}
                />
                <Route
                  path="/profile"
                  element={
                    <Profile
                      setCurrentSong={setCurrentSong}
                      setSongs={setSongs}
                      setAlert={setAlert}
                    />
                  }
                />
                <Route
                  path="/playlist"
                  element={<PlaylistPage setAlert={setAlert} />}
                />
                <Route path="/user" element={<div />} />
              </Routes>
            </Router>
          </div>
        </section>
      </section>
      {loginDisplay ? (
        <ModalLogin
          setAlert={setAlert}
          toggleModal={toggleModal}
          setConnected={setConnected}
        />
      ) : (
        <div />
      )}
      <Footer envName={envName} buildDate={buildDate} commitUrl={commitUrl} />
    </section>
  )
}

export default App
function someOtherData(): import('react').RefObject<HTMLAudioElement> {
  throw new Error('Function not implemented.')
}
