import "./App.scss";
import { Loader, ExploPlayer, Sidebar } from "components";
import { Player, Explorer, Album, Download, ModalLogin } from "views";

import { useEffect, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import datasong from "songs/datasongs";

function App() {
  const [loader, setLoader] = useState(true);
  const [songs, setSongs] = useState(datasong);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(datasong[0]);
  const [loginDisplay, setLoginDisplay] = useState(false);
  // Temporary this value will be stored in the token
  const [connected, setConnected] = useState(false)

  const audioElmt = useRef<HTMLAudioElement>(null) ?? someOtherData();

  const log = document.cookie.split('=')[1]

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 3000);

    if (isPlaying) {
      audioElmt.current?.play();
    } else {
      audioElmt.current?.pause();
    }

    if (log == "true") {
      setConnected(true)
    } else {
      setConnected(false)
    }

  }, [audioElmt, isPlaying]);

  const onPlaying = () => {
    const duration: number = audioElmt.current?.duration as number;
    const ct: number = audioElmt.current?.currentTime as number;

    setCurrentSong({
      ...currentSong,
      progress: (ct / duration) * 100,
      length: duration,
    });
  };

  const displayModal = (e: any) => {
    switch (loginDisplay) {
      case true:
        setLoginDisplay(false);
        break;
      case false:
        setLoginDisplay(true);
        break;
      default:
        break;
    }
  };

  return loader ? (
    <Loader />
  ) : (
    <section style={{ color: "black", height: window.innerHeight }}>
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
      <section style={{ color: "black", height: "75%" }}>
        <section className="container-app">
          <div className="contain-explorer">
            <Router>
              <Sidebar
                displayModal={displayModal}
                connected={connected}
                setConnected={setConnected}
              />
              {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Routes>
                <Route path="/" element={<Explorer />} />
                <Route path="/album" element={<Album />} />
                <Route path="/player" element={<Player />} />
                <Route path="/download" element={<Download />} />
                <Route path="/user" element={<div />} />
              </Routes>
            </Router>
          </div>
        </section>
      </section>
      {loginDisplay ? <ModalLogin displayModal={displayModal} /> : <div />}
    </section>
  );
}

export default App;
function someOtherData(): import("react").RefObject<HTMLAudioElement> {
  throw new Error("Function not implemented.");
}
