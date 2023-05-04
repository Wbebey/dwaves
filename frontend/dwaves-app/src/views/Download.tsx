import 'styles/Explorer.scss'
import { SingleForm, AlbumForm, SwitchTab, CreatePlaylist } from 'components'
import { useEffect, useState } from 'react'
import { responseRequest } from 'models'
import axios from 'axios'

interface Props {
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Download: React.FC<Props> = ({ setAlert }) => {
  const [showForm, setShowForm] = useState('Single')
  const [genres, setGenres] = useState([{ id: 0, name: '' }])

  const getGenres = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/genres`,
        {
          withCredentials: true,
        },
      )
      setGenres(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGenres()
      .then((r) => console.log(r))
      .catch((r) => console.log(r))
  }, [])

  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      <SwitchTab
        values={['Single', 'Album', 'Playlist']}
        showForm={showForm}
        setShowForm={setShowForm}
      />

      {showForm === 'Single' ? (
        <SingleForm setAlert={setAlert} genres={genres} />
      ) : showForm === 'Album' ? (
        <AlbumForm setAlert={setAlert} genres={genres} />
      ) : (
        <CreatePlaylist setAlert={setAlert} />
      )}
    </div>
  )
}
