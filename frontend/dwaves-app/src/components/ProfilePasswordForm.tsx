import axios, { AxiosError } from 'axios'
import { responseRequest } from 'models'
import { SubmitHandler, useForm } from 'react-hook-form'

type UserPasswordFormInput = {
  oldPassword: string
  password: string
  passwordConfirmation: string
}

interface Props {
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
  getCurrentUser: () => Promise<void>
}

const ProfilePasswordForm: React.FC<Props> = ({ setAlert, getCurrentUser }) => {
  const { register, handleSubmit, reset } = useForm<UserPasswordFormInput>()

  const updatePassword = async (data: UserPasswordFormInput) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me/updatePassword`,
        data,
        {
          withCredentials: true,
        },
      )
      displayAlert('Password updated successfully', res.status)
      reset()
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

  const onSubmit: SubmitHandler<UserPasswordFormInput> = async (data) => {
    await updatePassword(data)
    await getCurrentUser()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-4"
    >
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Old password</span>
        </label>
        <input
          type="password"
          {...register('oldPassword')}
          placeholder="Type here"
          className="input input-ghost"
        />
      </div>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">New password</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="input input-ghost"
          {...register('password')}
        />
      </div>
      <div className="form-control w-full my-6">
        <label className="label">
          <span className="label-text">Password confirmation</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="input input-ghost"
          {...register('passwordConfirmation')}
        />
      </div>
      <button type="submit" className="btn btn-primary m-8">
        Reset password
      </button>
    </form>
  )
}

export default ProfilePasswordForm
