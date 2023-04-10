import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form'

import ticketTemplate from './../../public/ticketTemplate.png'

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
      className="bg-white h-9 w-72 mt-2 rounded-lg border-2 border-teal-300 text-center px-3"
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

  console.log('vibes' + watch('Ticket price in VIBES'))
  return (
    <div>
      <h3 className="text-3xl text-center">
        Create a Decentralized Concert 🤯!
      </h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-row mx-10">
          <div className="w-2/3 self-center flex items-center flex-col ml-5 mr-12">
            <div>
              <div className="absolute pl-5">
                <p className="mt-5 text-4xl font-bol italic">
                  {watch('Event name')}
                </p>
                <p className="mt-9 text-xl">{watch('Date')}</p>
                <div className="mt-7 flex flex-row justify-between w-96">
                  <p className="text-xl font-bold">{watch('Event place')}</p>
                  <p className="text-xl">{watch('Genre')}</p>
                  <p className="text-xl text-blue-600 font-bold">
                    {watch('Ticket price in VIBES')}{' '}
                    {watch('Ticket price in VIBES') !== null && 'VIBES'}
                  </p>
                </div>
              </div>
              <img src={ticketTemplate} alt="" />
            </div>

            <button
              className="mt-10 self-center w-1/3 bg-teal-300 h-16 rounded-lg"
              type="submit"
            >
              Mint {watch('Number of available tickets')} tickets NFTs
            </button>
          </div>
          <div className="w-1/3">
            <Input label={'Event name'} register={register} required={true} />
            <Input
              label={'Date'}
              register={register}
              required={true}
              type={'datetime-local'}
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
            <div className="flex flex-col items-center mb-2">
              <label className="text-lg">Event place</label>

              <select
                className="bg-white h-9 w-72 mt-2 rounded-lg border-2 border-teal-300 text-center px-3"
                {...register('Event place')}
              >
                <option value=""></option>
                <option value="MetaVerse">MetaVerse</option>
                <option value="Teams">Teams</option>
              </select>
            </div>
            <Input label={'Genre'} register={register} required={true} />
          </div>
        </div>
      </form>
    </div>
  )
}
