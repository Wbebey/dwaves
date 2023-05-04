import './App.scss'

import {
  Player,
  Explorer,
  Album,
  Artist,
  Download,
  ModalLogin,
  Profile,
  PlaylistPage,
  Playlist,
  Marketplace,
  Settings,
} from 'views'
import { Loader, Sidebar, Alert, Footer } from 'components'
import { PlayerWrapper } from 'components/player'
import { Icon } from 'components/shared'

import { responseRequest, Music, AlbumDetail } from 'models'
import {
  playPause,
  playRandomSong,
  incrementlisteningsMusic,
} from 'songs/listenMusic'

import { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }

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
  const [wallet, setWallet] = useState<string>('')
  const [likedMusics, setLikedMusics] = useState<string[]>([])
  const[dataUser, setDataUser]= useState<any>()
  const [currentUser, setCurrentUser] = useState<any>()

  const envName = import.meta.env.VITE_NODE_ENV
  const buildDate = import.meta.env.VITE_APP_BUILD_DATE
  const commitUrl = import.meta.env.VITE_APP_COMMIT_URL
  const [listenings, setListenings] = useState<number>()

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

  const onPlaying = async () => {
    const duration: number = audioElmt.current?.duration as number
    const ct: number = audioElmt.current?.currentTime as number
    if (songs) {
      setCurrentSong({
        ...currentSong!,
        progress: (ct / duration) * 100,
        length: duration,
      })
    }
  }

  useEffect(() => {
    setListenings(currentSong?.listenings)
  }, [songs])

  const endedSong = () => {
    setListenings(listenings! + 1)
    currentSong &&
      listenings && incrementlisteningsMusic(currentSong, listenings)
    repeat && playPause(audioElmt, false, setIsPlaying)
    if (random) {
      setCurrentSong(playRandomSong(songs!))
      setTimeout(() => {
        playPause(audioElmt, false, setIsPlaying)
      }, 1000)
      setListenings(listenings)
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
      setDataUser(res.data)
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

  const requestConnectionMetamask = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setWallet(accounts)
    }
  }

  const getCurrentUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me`,
        {
          withCredentials: true,
        }
      )
      setCurrentUser(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    connected && getCurrentUser()
  },[connected])

  return loader ? (
    <Loader />
  ) : (
    <section style={{ color: 'black', height: window.innerHeight }}>
      {currentSong && (
        <audio
          onEnded={(e) => endedSong()}
          src={currentSong.src}
          ref={audioElmt}
          onTimeUpdate={onPlaying}
        />
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
                wallet={wallet}
                requestConnectionMetamask={requestConnectionMetamask}
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
                  path="/marketplace"
                  element={
                    <Marketplace
                      wallet={wallet}
                      requestConnectionMetamask={requestConnectionMetamask}
                    />
                  }
                />
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
                      currentUserData={currentUser}
                    />
                  }
                />
                <Route
                  path="/playlist"
                  element={<PlaylistPage setAlert={setAlert} />}
                />
                <Route path="/artist/:id" element={<Artist />} />
                <Route path="/user" element={<div />} />
                <Route
                  path="/settings"
                  element={
                    <Settings
                      envName={envName}
                      buildDate={buildDate}
                      commitUrl={commitUrl}
                    />
                  }
                />
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
