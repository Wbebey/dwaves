import axios, { AxiosError } from 'axios'
import { ProfileCircle } from 'iconsax-react'
import { CurrentUser, responseRequest } from 'models'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type UserInfoFormInput = {
  username: string
  email: string
  avatar: File[]
}

interface Props {
  currentUser: CurrentUser
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
  getCurrentUser: () => Promise<void>
}

const ProfileInfoForm: React.FC<Props> = ({
  currentUser,
  setAlert,
  getCurrentUser,
}) => {
  const { register, handleSubmit } = useForm<UserInfoFormInput>()

  const [avatarURL, setAvatarURL] = useState('')

  const updateInfo = async (formData: FormData) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me/updateInfo`,
        formData,
        {
          withCredentials: true,
        },
      )
      displayAlert('Profile updated successfully', res.status)
    } catch (err) {
      if (!(err instanceof AxiosError)) {
        displayAlert('An error occured', 500)
        return
      }

      if (Array.isArray(err?.response?.data)) {
        displayAlert(err?.response?.data[0].msg, err?.response?.status || 500)
      } else {
        displayAlert(err?.response?.data.message, err?.response?.status || 500)
      }
    }
  }

  const displayAlert = (msg: string, status: number) => {
    setAlert({ response: msg, status: status, visible: true })
    setTimeout(() => {
      setAlert({ response: '', status: 0, visible: false })
    }, 3000)
  }

  const onSubmit: SubmitHandler<UserInfoFormInput> = async (data) => {
    console.log(data)
    const formData = new FormData()

    formData.append('username', data.username)
    formData.append('email', data.email)

    if (data.avatar.length > 0) {
      formData.append('avatar', data.avatar[0])
    }

    await updateInfo(formData)
    await getCurrentUser()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-4"
    >
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          {...register('username', {
            value: currentUser.username,
          })}
          placeholder="Type here"
          className="input input-ghost"
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          placeholder="Type here"
          className="input input-ghost"
          {...register('email', {
            value: currentUser.email,
          })}
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Avatar</span>
        </label>
        <div className="grid grid-cols-[max-content_1fr] gap-4 items-center">
          {avatarURL || currentUser.avatar ? (
            <img
              src={avatarURL || currentUser.avatar}
              alt="Avatar URL"
              className="aspect-square object-cover rounded-full w-24 "
            />
          ) : (
            <div className="bg-gray-400 rounded-full h-24 w-24 grid place-items-center">
              <ProfileCircle size={64} />
            </div>
          )}
          <input
            type="file"
            className="file-input file-input-ghost"
            {...register('avatar', {
              onChange: (e) => {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onloadend = () => {
                  setAvatarURL(reader.result as string)
                }
                reader.readAsDataURL(file)
              },
            })}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary m-8">
        Update
      </button>
    </form>
  )
}

export default ProfileInfoForm
