import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form'

interface IFormValues {
  'Event name': string
  Date: string
  'Number of available tickets': number
  'Ticket price in VIBES': number
  'Event place': string
  Genre: string
  Age: number
}

type InputProps = {
  label: Path<IFormValues>
  register: UseFormRegister<IFormValues>
  type?: string
  required: boolean
}

const Input = ({ label, register, required, type = '' }: InputProps) => (
  <div className="flex flex-col items-center mb-2">
    <label className="text-lg">{label}</label>
    <input
      type={type}
      className="bg-white h-10 w-72 mt-2 rounded-xl border-2 border-teal-300 text-center"
      placeholder={label}
      {...register(label, { required })}
    />
  </div>
)

export const CreateConcert = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormValues>()
  const onSubmit: SubmitHandler<IFormValues> = (data) => console.log(data)

  return (
    <div>
      <h3 className="text-3xl text-center mb-5">
        Create a Decentralized Concert 🤯!
      </h3>
      <div className="flex flex-row mx-10">
        <div className="w-1/2 bg-red-100">HELLO</div>
        <div className="w-1/2">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input label={'Event name'} register={register} required={true} />
            <Input
              label={'Date'}
              register={register}
              required={true}
              type={'date'}
            />
            <Input
              label={'Number of available tickets'}
              register={register}
              required={true}
              type={'number'}
            />
            <Input
              label={'Ticket price in VIBES'}
              register={register}
              required={true}
              type={'number'}
            />
            <Input
              label={'Event place'}
              register={register}
              required={true}
              type={'number'}
            />
            <Input
              label={'Genre'}
              register={register}
              required={true}
              type={'number'}
            />
            <button type="submit">HEY HEY</button>
          </form>
        </div>
      </div>
    </div>
  )
}
