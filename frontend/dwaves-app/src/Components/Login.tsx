import { useForm } from "react-hook-form"

type User = {
    username: string
    email: string
    password: string
}

export const Login = () => {
    const { register, setValue, getValues, handleSubmit } = useForm<User>()

    return (
        <div className="flex flex-col justify-center">
            <div id="input-text" className="form-control w-full">
                <label className="label">
                    <span className="label-text">Username</span>
                </label>
                <input type="text" {...register('username')} placeholder="Type here" className="input input-ghost" />
            </div>
            <div id="input-text" className="form-control w-full">
                <label className="label">
                    <span className="label-text">Password</span>
                </label>
                <input type="text" placeholder="Type here" className="input input-ghost" />
            </div>
            <button type="submit" className="btn btn-primary m-8">Login</button>
        </div>
    ) 
}