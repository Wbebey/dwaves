import axios from 'axios'
import { responseRequest } from 'models'
import { useForm } from 'react-hook-form'

type User = {
  username: string
  email: string
  password: string
  passwordConfirmation: string
}

interface Props {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Register: React.FC<Props> = ({ setShowLogin, setAlert }) => {
  const { register, setValue, getValues, handleSubmit } = useForm<User>()

  const onSubmit = (data: any) => {
    console.log({ data })
    axios
      .post(`${import.meta.env.VITE_APP_BACK_URL}/auth/register`, data)
      .then((res) => {
        setShowLogin(false)
        displayAlert(res.data.message , res.status)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const displayAlert = (msg:string , status:number) => {
    setAlert({response : msg , status : status, visible: true })
    setTimeout(()=>{
      setAlert({response : "" , status : 0, visible: false })
    }, 3000)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center"
    >
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          {...register('username')}
          placeholder="Type here"
          className="input input-ghost"
        />
      </div>
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="text"
          {...register('email')}
          placeholder="Type here"
          className="input input-ghost"
        />
      </div>
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Password</span>
        </label>
        <input
          type="password"
          placeholder="Type here"
          className="input input-ghost"
          {...register('password')}
        />
      </div>
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Confirm password</span>
        </label>
        <input
          type="password"
          {...register('passwordConfirmation')}
          placeholder="Type here"
          className="input input-ghost"
        />
      </div>
      <button type="submit" className="btn btn-primary m-8">
        Register
      </button>
    </form>
  )
}
