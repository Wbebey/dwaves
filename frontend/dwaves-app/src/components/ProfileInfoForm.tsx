import { ProfileCircle } from 'iconsax-react'
import { CurrentUser } from 'models'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

type UserInfoFormInput = {
  username: string
  email: string
  avatar: File
}

interface Props {
  currentUser: CurrentUser
}

const ProfileInfoForm: React.FC<Props> = ({ currentUser }) => {
  const { register, handleSubmit } = useForm<UserInfoFormInput>()

  const [avatarURL, setAvatarURL] = useState('')

  const onSubmit: SubmitHandler<UserInfoFormInput> = (data) => {}

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
