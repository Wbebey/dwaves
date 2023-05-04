import { useEffect, useRef, useState } from 'react';
import './App.scss';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

import { Loader } from './Components/Loader'
import { ExploPlayer } from './Components/ExploPlayer';
import { Sidebar } from './Components/Sidebar';

import { Player } from './Pages/Player'
import { Explorer } from './Pages/Explorer'
import { Album } from './Pages/Album'
import { Download } from './Pages/Download'
import { ModalLogin } from './Pages/Login'

import datasong from './Musics/datasongs';

function App() {

  const [loader, setLoader] = useState(true)
  const [songs, setSongs] = useState(datasong)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(datasong[0])

  const audioElmt = useRef<HTMLAudioElement>(null) ?? someOtherData()

  useEffect(() => {

    if (isPlaying) {
      audioElmt.current?.play()
    }
    else {
      audioElmt.current?.pause()
    }
  }, [audioElmt, isPlaying])

  const onPlaying = () => {

    const duration: number = audioElmt.current?.duration as number
    const ct: number = audioElmt.current?.currentTime as number

    setCurrentSong({ ...currentSong, "progress": ct / duration * 100, "length": duration })

  }

  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, 3000)
  })

  return loader ? (<Loader />) : (
    <section style={{ color: 'black', height: window.innerHeight}}>
      <audio src={currentSong.Src} ref={audioElmt} onTimeUpdate={onPlaying} />
      <ExploPlayer
        audioElmt={audioElmt}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        songs={songs}
        setSongs={setSongs}
      />

      <section style={{ color: 'black', height: '75%' }}>
        <section className="container-app">
          <div className="contain-explorer">
            <Router>
              <Sidebar />
              {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Routes>
                <Route path="/" element={<Explorer />} />
                <Route path="/album" element={<Album />} />
                <Route path="/player" element={<Player />} />
                <Route path="/download" element={<Download />} />
                <Route path="/login" element={<Explorer />} />
              </Routes>
            </Router>
          </div>
        </section>
      </section>
      <Router>
        {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/login" element={<ModalLogin />} />
        </Routes>
      </Router>

    </section>
  )
}

export default App;
function someOtherData(): import("react").RefObject<HTMLAudioElement> {
  throw new Error("Function not implemented.");
}