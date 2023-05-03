import axios from 'axios'
import { useForm } from 'react-hook-form'
import { responseRequest } from 'models'

type User = {
  username: string
  email: string
  password: string
}

interface Props {
  toggleModal: () => void
  setConnected: React.Dispatch<React.SetStateAction<boolean>>
  setAlert: React.Dispatch<React.SetStateAction<responseRequest | undefined>>
}

export const Login: React.FC<Props> = ({ toggleModal, setConnected, setAlert }) => {
  const { register, setValue, getValues, handleSubmit } = useForm<User>()

  const onSubmit = (data: any) => {
    axios
      .post(`${import.meta.env.VITE_APP_BACK_URL}/auth/login`, data, {
        withCredentials: true,
      })
      .then((res) => {
        if (document.cookie.includes('loggedIn=true')) {
          setConnected(true)
          toggleModal()
          if (Array.isArray(res.data)) {
            displayAlert(res.data[0].msg , res.status)
          } else {
            displayAlert('connected successfully' , res.status)
          }
        } else {
          displayAlert("cookie not set" , res.status)
        }
      })
      .catch((err) => {
        if (Array.isArray(err.response.data)) {
          displayAlert(err.response.data[0].msg , err.response.status)
        } else {
          displayAlert(err.response.data.message , err.response.status)
        }
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
      className="flex flex-col justify-center gap-4"
    >
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
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
      <button type="submit" className="btn btn-primary m-8">
        Login
      </button>
    </form>
  )
}
