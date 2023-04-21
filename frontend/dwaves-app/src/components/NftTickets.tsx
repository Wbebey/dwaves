import React, { FC, useState } from 'react'
import { AlbumDetail, Music, FormattedEvents } from '../models'

interface Props {
  balance: string
  chainName: string
  chainId: string
  formattedEvents: FormattedEvents
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
              {event.availableTickets} places left
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
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [ticketToBuyId, setTicketToBuyId] = useState(0)

  return (
    <div className="h-[95%] overflow-scroll">
      <div>
        {balance}
        <div>
          {chainName} - {chainId}
        </div>
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
              setTicketToBuyId(index)
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
          <TheTicket event={formattedEvents[ticketToBuyId]} />
          <div className="modal-action">
            <label htmlFor="my-modal" className="btn btn-primary">
              Buy this ticket 🚀 !
            </label>
            <button onClick={() => setOpenModal(false)} className="btn ml-10">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
