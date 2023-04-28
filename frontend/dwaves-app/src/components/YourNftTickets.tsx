import React, { FC, useState } from 'react'
import { AlbumDetail, Music, FormattedEvents } from '../models'
import axios from 'axios'
import { BrowserProvider, ethers } from 'ethers'

import DwavesToken from '../abi/DwavesToken.json'
import ConcertTicketNFT from '../abi/ConcertTicketNFT.json'
import { TicketTemplate } from './TicketTemplate'

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }

interface Props {
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

export const YourNftTickets: FC<Props> = ({ myTickets }) => {
  return (
    <div className="h-[95%] overflow-scroll">
      <h2 className="text-center text-3xl">My Purchases - Concert Tickets</h2>
      <div className="flex flex-row flex-wrap justify-between mx-8">
        {myTickets.map((event, index) => (
          <div key={index} style={{width: 500}}>
            <TicketTemplate event={event} />
          </div>
        ))}
      </div>
    </div>
  )
}
