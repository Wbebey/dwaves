import { CurrentUser } from 'models'
import { SubmitHandler, useForm } from 'react-hook-form'

type UserPasswordFormInput = {
  oldPassword: string
  password: string
  passwordConfirmation: string
}

interface Props {
  currentUser: CurrentUser
}

const ProfilePasswordForm: React.FC<Props> = () => {
  const { register, handleSubmit } = useForm<UserPasswordFormInput>()

  const onSubmit: SubmitHandler<UserPasswordFormInput> = (data) => {}

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
