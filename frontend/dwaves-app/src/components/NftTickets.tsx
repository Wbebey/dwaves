import React, { FC, useState } from 'react'
import { AlbumDetail, Music, FormattedEvents } from '../models'
import axios from 'axios'
import { BrowserProvider, ethers } from 'ethers'

import DwavesToken from '../abi/DwavesToken.json'
import ConcertTicketNFT from '../abi/ConcertTicketNFT.json'

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }

interface Props {
  balance: string
  chainName: string
  chainId: string
  formattedEvents: FormattedEvents
  myTickets: {
    id: number
    name: string
    date: string
    daysUntilConcert: number
    place: string
    genre: string
    artist: string
    price: number
  }[]
}

const TheTicket = ({ event }: any) => {
  return (
    <div className="card bg-gray-50 border mx-2 my-4 hover:bg-teal-300">
      <div>
        <div className="absolute pl-5 pt-3 w-80">
          <p className="italic text-3xl">{event.name}</p>
          <p className="text-xl pt-2">by {event.artist}</p>
          <div className="flex flex-row justify-between pt-2">
            <p className="text-lg">{event.date}</p>
            <p className="text-lg">{event.genre}</p>
            <p className="text-lg"> {event.place}</p>
          </div>
          <div className="flex flex-row items-end justify-between">
            <p className="text-blue-500 text-xl">
              {event.availableTickets
                ? `${event.availableTickets} places left`
                : `Concert in ${event.daysUntilConcert} days`}
            </p>
            <p className="text-blue-600 font-bold text-center pt-2 text-2xl">
              {event.price} Vibes
            </p>
          </div>
        </div>
        <img src="./../../ticketTemplate.png" alt="" width={600} />
      </div>
    </div>
  )
}

export const NftTickets: FC<Props> = ({
  balance,
  chainName,
  chainId,
  formattedEvents,
  myTickets,
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [ticketToBuyId, setTicketToBuyId] = useState(0)
  const [ticketToOpen, setTicketToOpen] = useState(0)

  const approveTransaction = async (amount: number) => {
    console.log('Getting the dwaves token contract...')

    const provider = new BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const dwavesToken = new ethers.Contract(
      DwavesToken.address,
      DwavesToken.abi,
      signer,
    )
    const concertTicketNFT = new ethers.Contract(
      ConcertTicketNFT.address,
      ConcertTicketNFT.abi,
      signer,
    )

    const token_ = dwavesToken.connect(signer)

    console.log('Approve 535 tokens...')
    // console.log(dwavesToken)
    const tx = await dwavesToken.approve(ConcertTicketNFT.address, 900, {
      gasLimit: 100000,
    })
    await tx.wait()
    console.log(tx)

    console.log('Allowance...')
    console.log(signer.address)
    console.log(ConcertTicketNFT.address)
    const allowance = await dwavesToken.allowance(
      signer.address,
      ConcertTicketNFT.address,
    )
    console.log(allowance)
  }

  const buyTicket = async () => {
    try {
      await approveTransaction(230)
      const res = await axios.post(
        `${
          import.meta.env.VITE_APP_BACK_URL
        }/events/buyTicket/${ticketToBuyId}`,
        { truc: 'truc' },
        {
          withCredentials: true,
        },
      )
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="h-[95%] overflow-scroll">
      <div className="pl-5 pb-10">
        Your balance : {balance} SepoliaETH
        <div>
          Chain : {chainName} - {chainId}
        </div>
      </div>

      <h2 className="text-center text-3xl">My Purchases - Concert Tickets</h2>
      <div className="flex flex-row flex-wrap">
        {myTickets.map((event, index) => (
          <div key={index} className="w-1/2">
            <TheTicket event={event} />
          </div>
        ))}
      </div>

      <h2 className="text-center text-3xl">
        buy a ticket for one of these upcoming concerts !
      </h2>
      <div className="flex flex-row flex-wrap">
        {formattedEvents.map((event, index) => (
          <div
            key={index}
            onClick={() => {
              setOpenModal(true)
              setTicketToOpen(index)
              setTicketToBuyId(+event.ticketIdToBuy)
            }}
            className="w-1/2 cursor-pointer"
          >
            <TheTicket event={event} />
          </div>
        ))}
      </div>
      <input
        type="checkbox"
        checked={openModal}
        id="my-modal"
        className="modal-toggle"
        onChange={() => {
          setOpenModal(false)
        }}
      />
      <div className="modal">
        <div className="modal-box flex items-center flex-col modal-box w-9/12 max-w-5xl">
          <h3 className="font-bold text-2xl text-center mb-4 text-white">
            It's time for you 🤯 !
          </h3>
          <TheTicket event={formattedEvents[ticketToOpen]} />
          <div className="modal-action">
            <button
              className="btn btn-primary"
              onClick={() => {
                buyTicket()
                setOpenModal(false)
              }}
            >
              Buy this ticket 🚀 !
            </button>
            <button onClick={() => setOpenModal(false)} className="btn ml-10">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
