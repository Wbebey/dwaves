import axios from 'axios'
import 'styles/SingleForm.scss'
import { Icon } from 'components/shared'

import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

type Single = {
  title: string
  genre: string
  cover: File
  music: File
}

export const SingleForm = () => {
  const { register, setValue, getValues, handleSubmit } = useForm<Single>()
  const [filesExist, setFilesExist] = useState({ music: false, cover: false })

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) {
      return
    }
    switch (e.currentTarget.name) {
      case 'music':
        setFilesExist({ ...filesExist, music: true })
        break
      case 'cover':
        setFilesExist({ ...filesExist, cover: true })
        break
      default:
        console.warn('invalid input name')
        break
    }
    setValue(e.currentTarget.name as keyof Single, e.target.files[0])
  }

  const onSubmit = (data: Single) => {
    const form = new FormData()
    form.append('genre', data.genre)
    form.append('name', data.title)
    form.append('cover', data.cover)
    form.append('music', data.music)
    axios
      .post(`${import.meta.env.VITE_APP_BACK_URL}/musics/pinSingle`, form, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
      <section className="section-download">
        <div className="header">
          <div id="contain-title" className="flex row nowrap">
            <Icon icon="return" size="Large" />
            <div className="divider divider-horizontal"></div>
            <h1>Upload a new file</h1>
          </div>
          <div id="action" className="flex row">
            <button className="clear">Clear</button>
            <button type="submit" className="upload">
              Upload
            </button>
          </div>
        </div>
        <div className="content">
          <div className="form-file">
            <div className="logo-upload">
              <Icon icon="song" />
            </div>
            {filesExist.music ? (
              <span>{getValues('music').name}</span>
            ) : (
              <span>Upload Music</span>
            )}
            <input
              type="file"
              name="music"
              onChange={(e) => {
                handleFile(e)
              }}
              className="input-file"
            />
            <p>
              Drop files directly here or <span>browse</span> from your device
            </p>
          </div>
          <br />
          <div className="form-file">
            <div className="logo-upload">
              <Icon icon="upload" />
            </div>
            {filesExist.cover ? (
              <span>{getValues('cover').name}</span>
            ) : (
              <span>Upload Cover</span>
            )}
            <input
              type="file"
              name="cover"
              onChange={(e) => {
                handleFile(e)
              }}
              className="input-file"
            />
            <p>
              Drop files directly here or <span>browse</span> from your device
            </p>
          </div>
          <div id="input-text" className="form-control w-full">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Type here"
              className="input input-ghost"
            />
          </div>
          <div id="input-text" className="form-control w-full">
            <label className="label">
              <span className="label-text">Genre</span>
            </label>
            <input
              type="text"
              {...register('genre')}
              placeholder="Type here"
              className="input input-ghost"
            />
          </div>
        </div>
      </section>
    </form>
  )
}
