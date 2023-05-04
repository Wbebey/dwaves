import axios from "axios";
import { useForm } from "react-hook-form";

type User = {
  username: string;
  email: string;
  password: string;
  passwordConfirmation:string
};

export const Register = () => {
  const { register, setValue, getValues, handleSubmit } = useForm<User>();


  const onSubmit = (data: any) => {
    axios.post(`${import.meta.env.VITE_APP_BACK_URL}/api/v1/auth/register`, data)
      .then()
      .catch()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center">
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          type="text"
          {...register("username")}
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
      <div id="input-text" className="form-control w-full">
        <label className="label">
          <span className="label-text">Confirm password</span>
        </label>
        <input
          type="password"
          {...register("passwordConfirmation")}
          placeholder="Type here"
          className="input input-ghost"
        />
      </div>
      <button type="submit" className="btn btn-primary m-8">
        Register
      </button>
    </form>
  );
};
