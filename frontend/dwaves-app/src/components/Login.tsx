import axios from "axios";
import { useForm } from "react-hook-form";

type User = {
  username: string;
  email: string;
  password: string;
};

export const Login = () => {
  const { register, setValue, getValues, handleSubmit } = useForm<User>();

  const onSubmit = (data: any) => {
    axios.post(`${import.meta.env.VITE_APP_BACK_URL}/auth/login`, data, {withCredentials: true})
      .then(res => { 
        window.location.reload()
      })
      .catch()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center">
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="email"
          {...register("email")}
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
          {...register("password")}
        />
      </div>
      <button type="submit" className="btn btn-primary m-8">
        Login
      </button>
    </form>
  );
};