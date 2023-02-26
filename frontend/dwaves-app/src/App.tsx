import './App.scss'
import { Loader, ExploPlayer, Sidebar, Alert } from 'components'
import { Player, Explorer, Album, Download, ModalLogin } from 'views'

import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import datasong from 'songs/datasongs'
import { responseRequest } from 'models'

function App() {
  const [loader, setLoader] = useState(true)
  const [songs, setSongs] = useState(datasong)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<any>(datasong.musics[0])
  const [loginDisplay, setLoginDisplay] = useState(false)
  const [alert , setAlert]= useState<responseRequest>()
  // Temporary this value will be stored in the token
  const [connected, setConnected] = useState(false)

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

    setCurrentSong({
      ...currentSong,
      progress: (ct / duration) * 100,
      length: duration,
    })
  }

  const toggleModal = () => {
    setLoginDisplay(!loginDisplay)
  }

  return loader ? (
    <Loader />
  ) : (
    <section style={{ color: 'black', height: window.innerHeight }}>
      <audio src={currentSong.src} ref={audioElmt} onTimeUpdate={onPlaying} />
      <ExploPlayer
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songs={songs}
        setSongs={setSongs}
      />
      {
        alert?.visible &&
        <Alert alert={alert}/>
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
                <Route path="/album/:id" element={<Album setCurrentSong={setCurrentSong} setSongs={setSongs} />} />
                <Route path="/player" element={<Player />} />
                <Route path="/download" element={<Download setAlert={setAlert} />} />
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
    </section>
  )
}

export default App
function someOtherData(): import('react').RefObject<HTMLAudioElement> {
  throw new Error('Function not implemented.')
}
