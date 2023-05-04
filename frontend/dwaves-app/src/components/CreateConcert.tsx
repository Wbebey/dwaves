import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import Datepicker from 'react-tailwindcss-datepicker'
import axios from 'axios'
import Confetti from 'react-confetti'
import { BrowserProvider } from 'ethers'

interface IFormValues {
  'Event name': string
  Date: Date
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
  step?: number
  required: boolean
}

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }

type DatepickerDate = {
  startDate: Date
}

const Input = ({
  label,
  register,
  required,
  type = '',
  step = 0,
}: InputProps) => (
  <div className="flex flex-col items-center mb-2">
    <label className="text-lg">{label}</label>
    <input
      type={type}
      step={step}
      className="bg-white h-9 w-72 mt-2 rounded-lg border-2 border-teal-300 text-center px-3"
      placeholder={label}
      {...register(label, { required })}
    />
  </div>
)

export const CreateConcert = ({
  fetchMyEvents,
}: {
  fetchMyEvents: (provider: any) => Promise<void>
}) => {
  const chainName = 'sepolia'
  const [date, setDate] = useState<DatepickerDate>()
  const [transactionInProgress, setTransactionInProgress] = useState(false)
  const [transactionIsDone, setTransactionIsDone] = useState(false)
  const [openTransactionFailedModal, setOpenTransactionFailedModal] =
    useState(false)
  const [txnHash, setTxnHash] = useState('')
  const [genres, setGenres] = useState([{ id: 0, name: '' }])

  const handleValueChange = (newValue: any) => {
    setDate(newValue)
  }

  const getGenres = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/genres`,
        {
          withCredentials: true,
        },
      )
      setGenres(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getGenres()
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm<IFormValues>()

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    const eventsDetails = {
      name: data['Event name'],
      date: date!.startDate,
      location: data['Event place'],
      genre: data.Genre,
      ticketCount: data['Number of available tickets'],
      ticketPrice: data['Ticket price in VIBES'],
    }
    console.log(eventsDetails)
    mintEventNft(eventsDetails)
  }

  const mintEventNft = async (eventsDetails: any) => {
    setTransactionInProgress(true)
    const provider = new BrowserProvider(window.ethereum)
    try {
      const res: any = await axios.post(
        `${import.meta.env.VITE_APP_BACK_URL}/events`,
        eventsDetails,
        {
          withCredentials: true,
        },
      )
      console.log(res)
      setTxnHash(res.data.transactionHash)
      await fetchMyEvents(provider)
      setTransactionInProgress(false)
      setTransactionIsDone(true)
      reset()
      // @ts-ignore
      setDate({ startDate: '' })
      console.log('fetch hey hey')
    } catch (err) {
      setTransactionInProgress(false)
      setTransactionIsDone(true)
      setOpenTransactionFailedModal(true)
      console.log(err)
    }
  }

  return (
    <div>
      {transactionIsDone && !openTransactionFailedModal && (
        <Confetti gravity={0.03} />
      )}
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
                <p className="mt-9 text-xl">
                  {date?.startDate && date.startDate.toString()}
                </p>
                <div className="mt-7 flex flex-row justify-between w-96">
                  <p className="text-xl font-bold">{watch('Event place')}</p>
                  <p className="text-xl">{watch('Genre')}</p>
                  <p className="text-xl text-blue-600 font-bold">
                    {watch('Ticket price in VIBES')}{' '}
                    {watch('Ticket price in VIBES') && 'VIBES'}
                  </p>
                </div>
              </div>
              <img src="./../../ticketTemplate.png" alt="" />
            </div>

            <button
              className={
                'disabled:opacity-50 mt-10 self-center w-1/3 bg-teal-300 h-16 rounded-lg'
              }
              type="submit"
              disabled={!isDirty || !isValid}
            >
              {transactionInProgress ? (
                <>
                  <progress className="progress progress-primary w-9/12"></progress>
                </>
              ) : (
                <>Mint {watch('Number of available tickets')} tickets NFTs</>
              )}
            </button>
          </div>
          <div className="w-1/3 flex items-center flex-wrap">
            <Input label={'Event name'} register={register} required={true} />
            <label className="text-lg text-center w-full mr-9">Date</label>
            <div className="border-2 border-teal-300 h-9 w-72 mt-2 rounded-lg flex items-center ">
              <Datepicker
                inputClassName="bg-white pl-5"
                primaryColor={'cyan'}
                asSingle={true}
                // @ts-ignore
                value={date}
                onChange={handleValueChange}
              />
            </div>

            <div className="flex flex-col items-center mb-2">
              <label className="text-lg">Event place</label>
              <select
                className="bg-white h-9 w-72 mt-2 rounded-lg border-2 border-teal-300 text-center px-3"
                {...register('Event place')}
                defaultValue={''}
              >
                <option value="" disabled hidden>
                  Choose your place
                </option>
                <option value="MetaVerse">MetaVerse</option>
                <option value="Teams">Teams</option>
              </select>
            </div>

            <div className="flex flex-col items-center mb-2">
              <label className="text-lg">Genre</label>
              <select
                className="bg-white h-9 w-72 mt-2 rounded-lg border-2 border-teal-300 text-center px-3"
                {...register('Genre')}
                defaultValue={''}
              >
                <option value="" disabled hidden>
                  Choose the genre
                </option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.name}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

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
              type={''}
              step={0.01}
            />
          </div>
        </div>
      </form>

      <input
        type="checkbox"
        checked={transactionIsDone}
        id="my-modal"
        className="modal-toggle"
        onChange={() => {
          setTransactionIsDone(false)
          setOpenTransactionFailedModal(false)
        }}
      />
      <div className="modal w-full">
        <div className="modal-box flex items-center flex-col">
          {!openTransactionFailedModal ? (
            <>
              <h3 className="font-bold text-2xl text-center mb-4 text-white">
                Hey ! Your virtual concert has been created 🥳 🎉 !
              </h3>
              <img
                className="w-80"
                src={`https://media.tenor.com/XnsvYVbmUIUAAAAC/p%C3%BAblico-concierto.gif`}
                alt=""
              />

              <p className="mr-4 mt-7 text-justify text-white">
                Great news! The virtual concert NFT tickets have been
                successfully minted. Get ready for an unforgettable experience
                featuring Dwaves. These NFT tickets are now available for
                purchase!
              </p>

              <a
                href={`https://${chainName}.etherscan.io/tx/${txnHash}`}
                target="_blank"
                className="btn btn-ghost normal-case text-xl flex flex-row items-center mt-5"
              >
                <p className="text-white">View Transaction on Etherscan</p>
              </a>

              <div className="modal-action">
                <label htmlFor="my-modal" className="btn">
                  PLUS ULTRA 💥 !
                </label>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-2xl text-center mb-4 text-white">
                Sorry your transaction failed ️😔 ...
              </h3>
              <img
                className="w-80"
                src={`https://media.tenor.com/Hr98vjSz-V8AAAAC/cat-kitty.gif`}
                alt=""
              />
              <p className="mr-4 mt-7 text-justify text-white">
                Look at the error in the console for more details, and try again
                later
              </p>
              <div className="modal-action">
                <label htmlFor="my-modal" className="btn">
                  Try later ... 😕
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
