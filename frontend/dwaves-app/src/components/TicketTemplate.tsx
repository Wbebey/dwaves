import React from 'react'

export const TicketTemplate = ({ event }: any) => {
  return (
    <div className="card bg-gray-50 border mx-2 my-4 hover:bg-teal-300">
      <div>
        <div className="absolute pl-5 pt-1 w-80">
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
