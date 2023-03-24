import './App.scss'
import { Loader, ExploPlayer, Sidebar, Alert, Footer } from 'components'
import { Player, Explorer, Album, Download, ModalLogin, Profile } from 'views'

import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Icon } from "components/shared";
import { responseRequest, Music, AlbumDetail } from 'models'
import { PlayPause, PlayRandomSong } from 'songs/listenMusic'

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
        PlayPause(audioElmt, false, setIsPlaying)
      }
    }
    if (random) {
      if (currentSong?.progress! >= 99) {
        setCurrentSong(PlayRandomSong(songs!));
        setTimeout(() => {
          PlayPause(audioElmt, false, setIsPlaying)
        }, 1000)
      }
    }
  }

  const toggleModal = () => {
    setLoginDisplay(!loginDisplay)
  }

  return loader ? (
    <Loader />
  ) : (
    <section style={{ color: 'black', height: window.innerHeight }}>
      {
        currentSong &&
        <audio src={currentSong.src} ref={audioElmt} onTimeUpdate={onPlaying} />
      }
      {
        currentSong ?
          <ExploPlayer
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
            PlayRandomSong={PlayRandomSong}
          />
          :
          <div id="contain-top-player">
            <div id='player-bar' className="flex justify-center w-full">
              <div id="nav-widget-player" className="flex row nowrap">
                <Icon icon="random" />
                <Icon icon="previous" />
                <Icon icon="play" />
                <Icon icon="next" />
                <Icon icon="loop" />
              </div>
            </div>
          </div>
      }
      {
        alert?.visible &&
        <Alert alert={alert} />
      }
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
                <Route path="/album/:id" element={<Album setCurrentSong={setCurrentSong} setSongs={setSongs} audioElmt={audioElmt} isPlaying={isPlaying} setIsPlaying={setIsPlaying} setArtist={setArtist} />} />
                <Route path="/player" element={<Player />} />
                <Route path="/download" element={<Download setAlert={setAlert} />} />
                <Route path="/profile" element={<Profile setCurrentSong={setCurrentSong} setSongs={setSongs} setAlert={setAlert} />} />
                <Route path="/user" element={<div />} />
              </Routes>
            </Router>
          </div>
        </section>
      </section>
      {loginDisplay ? (
        <ModalLogin setAlert={setAlert} toggleModal={toggleModal} setConnected={setConnected} />
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
