import React, { useEffect, useState } from 'react'
import {
  CreateConcert,
  Kitsune,
  NftTickets,
  SwitchTab,
  YourConcerts,
} from '../components'
import { FormattedEvents } from '../models'
import { BrowserProvider, ethers } from 'ethers'

import ConcertTicketNFT from '../abi/ConcertTicketNFT.json'
import moment from 'moment'
import axios from 'axios'

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }

interface Props {
  wallet: string
  requestConnectionMetamask: () => Promise<void>
}

export const Marketplace: React.FC<Props> = ({
  wallet,
  requestConnectionMetamask,
}) => {
  const [myUsername, setMyUsername] = useState('')
  const [showTickets, setShowTickets] = useState('NFT Tickets')
  const [balance, setBalance] = useState('')
  const [chainName, setChainName] = useState('')
  const [chainId, setChainId] = useState('')

  const [allEvents, setAllEvents] = useState([])
  const [formattedEvents, setFormattedEvents] = useState<FormattedEvents>([
    {
      id: 0,
      name: '',
      date: '',
      place: '',
      genre: '',
      artist: '',
      price: 0,
      availableTickets: 0,
      ticketIdToBuy: '',
    },
  ])

  const [myTickets, setMyTickets] = useState([
    {
      id: 0,
      name: '',
      date: '',
      daysUntilConcert: 0,
      place: '',
      genre: '',
      artist: '',
      price: 0,
    },
  ])

  const [allMyEvents, setAllMyEvents] = useState([
    {
      name: '',
      date: '',
      daysUntilConcert: '',
      place: '',
      genre: '',
      totalTickets: 0,
      price: 0,
      ticketSold: 0,
    },
  ])

  useEffect(() => {
    getConnectedUsername()
  }, [])

  useEffect(() => {
    if (wallet) {
      const provider = new BrowserProvider(window.ethereum)

      fetchNetworkDetailsAndBalance(provider)
      fetchAllEventDetails(provider)
      fetchMyTickets(provider)
      fetchMyEvents(provider)
    }
  }, [wallet])

  const getConnectedUsername = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACK_URL}/users/me`,
        {
          withCredentials: true,
        },
      )
      setMyUsername(res.data.username)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchNetworkDetailsAndBalance = (provider: any) => {
    provider.getBalance(wallet[0]).then((result: any) => {
      setBalance(ethers.formatEther(result))
    })

    provider.getNetwork().then((result: any) => {
      setChainName(result.name)
      setChainId(result.chainId.toString())
    })
  }

  const fetchAllEventDetails = async (provider: any) => {
    const signer = await provider.getSigner()
    const concertTicketNFT = new ethers.Contract(
      ConcertTicketNFT.address,
      ConcertTicketNFT.abi,
      signer,
    )
    const ticketNFTContract = await concertTicketNFT.getAllTickets()
    setAllEvents(ticketNFTContract)

    const currentDate = new Date().getTime()
    const uniqueEventsWithIdEvent = ticketNFTContract.filter(
      (object: any, index: number, array: any) =>
        array.findIndex(
          (filteredObject: any) => filteredObject[1] === object[1],
        ) === index && object[3] > currentDate,
    )

    function falseCountsAndFirstFalseById(tableau: any) {
      const falseCountsAndFirstFalse: any = {}
      tableau.forEach((objet: any) => {
        if (falseCountsAndFirstFalse[objet[1]] === undefined) {
          falseCountsAndFirstFalse[objet[1]] = {
            count: 0,
            firstFalseId: undefined,
          }
        }
        if (objet[9] === false) {
          falseCountsAndFirstFalse[objet[1]].count++
          if (falseCountsAndFirstFalse[objet[1]].firstFalseId === undefined) {
            falseCountsAndFirstFalse[objet[1]].firstFalseId =
              objet[0].toString()
          }
        }
      })
      return falseCountsAndFirstFalse
    }

    const formattedEvents: any = []
    uniqueEventsWithIdEvent.forEach((event: any) => {
      formattedEvents.push({
        id: event[1],
        name: event[2],
        date: moment(Number(event[3])).format('MM/DD/YYYY'),
        place: event[4],
        genre: event[5],
        artist: event[6],
        price: parseFloat(event[8]),
        availableTickets:
          falseCountsAndFirstFalseById(ticketNFTContract)[event[1]].count,
        ticketIdToBuy:
          falseCountsAndFirstFalseById(ticketNFTContract)[event[1]]
            .firstFalseId,
      })
    })
    // console.log(formattedEvents)
    setFormattedEvents(formattedEvents)
  }

  const fetchMyTickets = async (provider: any) => {
    const signer = await provider.getSigner()
    const concertTicketNFT = new ethers.Contract(
      ConcertTicketNFT.address,
      ConcertTicketNFT.abi,
      signer,
    )
    const myTickets = await concertTicketNFT.getMyTickets()
    const myTicketsFormatted = myTickets
      .map((ticket: any) => ({
        id: ticket[0],
        name: ticket[2],
        date: moment(Number(ticket[3])).format('MM/DD/YYYY'),
        daysUntilConcert: moment(Number(ticket[3])).diff(moment(), 'days'),
        place: ticket[4],
        genre: ticket[5],
        artist: ticket[6],
        price: parseFloat(ticket[8]),
      }))
      .filter((ticket: any) => ticket.daysUntilConcert >= 0)
    // .filter((ticket: any) => ticket.daysUntilConcert >= 0 && ticket.artist !== myUsername)
    // console.log(myTicketsFormatted)
    setMyTickets(myTicketsFormatted)
  }

  const fetchMyEvents = async (provider: any) => {
    const signer = await provider.getSigner()
    const concertTicketNFT = new ethers.Contract(
      ConcertTicketNFT.address,
      ConcertTicketNFT.abi,
      signer,
    )
    const myEvents = await concertTicketNFT.getMyEvents()

    const formattedEvents = myEvents
      .map((event: any) => ({
        name: event[1],
        date: moment(Number(event[2])).format('MM/DD/YYYY'),
        daysUntilConcert: moment(Number(event[2])).diff(moment(), 'days'),
        place: event[3],
        genre: event[4],
        totalTickets: event[6].toString(),
        price: event[7].toString(),
        ticketSold: event[8].toString(),
      }))
      .filter((ticket: any) => ticket.daysUntilConcert >= 0)
    setAllMyEvents(formattedEvents)
  }

  return (
    <div
      className="contain-download"
      style={{ width: '100%', height: '100%', background: 'white' }}
    >
      {wallet === '' ? (
        <div className={'h-[97%] pt-[30px] pl-[20px]'}>
          <div className="w-full h-[90%] overflow-scroll flex flex-col items-center">
            <p className="text-xl mt-5 mx-40 text-center">
              Ready to explore the exciting offerings on Dwaves marketplace?
              Simply log in to your MetaMask account to get started
            </p>
            <p className="text-xl my-10">Click on the Fox !</p>
            <div className="cursor-pointer" onClick={requestConnectionMetamask}>
              <Kitsune />
            </div>
          </div>
        </div>
      ) : (
        <>
          <SwitchTab
            values={['NFT Tickets', 'Your future shows', 'Create a concert']}
            showForm={showTickets}
            setShowForm={setShowTickets}
          />
          <div className={'h-[97%] pt-[20px]'}>
            {showTickets === 'NFT Tickets' ? (
              <NftTickets
                balance={balance}
                chainName={chainName}
                chainId={chainId}
                formattedEvents={formattedEvents}
                myTickets={myTickets}
              />
            ) : showTickets === 'Your future shows' ? (
              <YourConcerts allMyEvents={allMyEvents} />
            ) : (
              <CreateConcert />
            )}
          </div>
        </>
      )}
    </div>
  )
}
