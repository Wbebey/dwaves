import React, { FC, useState } from 'react'
import { TicketTemplate } from './TicketTemplate'
import axios from 'axios'
import { BrowserProvider, ethers } from 'ethers'
import DwavesToken from '../abi/DwavesToken.json'
import ConcertTicketNFT from '../abi/ConcertTicketNFT.json'
import { FormattedEvents } from '../models'
import Confetti from 'react-confetti'

declare const window: Window &
  typeof globalThis & {
    ethereum: any
  }

type Props = {
  vibesBalance: string
  sepoliaBalance: string
  chainName: string
  chainId: string
  formattedEvents: FormattedEvents
  fetchMyTickets: (provider: any) => Promise<void>
}

export const TicketPurchase: FC<Props> = ({
  vibesBalance,
  sepoliaBalance,
  chainName,
  chainId,
  formattedEvents,
  fetchMyTickets,
}) => {
  const [transactionInProgress, setTransactionInProgress] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [openTransactionFailedModal, setOpenTransactionFailedModal] =
    useState(false)
  const [openTransactionModalDone, setOpenTransactionModalDone] =
    useState(false)
  const [txnHash, setTxnHash] = useState('')
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
    setTransactionInProgress(true)
    const provider = new BrowserProvider(window.ethereum)
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
      setTxnHash(res.data.transactionHash)
      console.log('start timeout')
      await new Promise((resolve) => {
        setTimeout(resolve, 30000)
      })
      console.log('end timeout')
      await fetchMyTickets(provider)
      setTransactionInProgress(false)
      setOpenTransactionModalDone(true)
    } catch (error) {
      console.log(error)
      setTransactionInProgress(false)
      setOpenTransactionFailedModal(true)
      setOpenTransactionModalDone(true)
    }
  }

  return (
    <div className="h-[95%] overflow-scroll">
      {openTransactionModalDone && !openTransactionFailedModal && (
        <Confetti gravity={0.03} />
      )}
      <div className="pl-5 w-44">
        <h4 className="font-bold text-xl pl-3">Your Balance</h4>
        <div>
          <div className="flex flex-row items-center pr-3.5 justify-end">
            <p>{vibesBalance.toString()} VIBES</p>
            <img
              src="/VersionTokenLogo.png"
              alt="ethereumLogo"
              width={18}
              style={{ marginLeft: 5 }}
            />
          </div>
          <div className="flex flex-row items-center pr-2 justify-end">
            <p>{sepoliaBalance.substring(0, 5)} ETH</p>
            <img
              src="/ethereumLogo.jpg"
              alt="ethereumLogo"
              width={30}
            />
          </div>
        </div>
      </div>
      <h2 className="text-center text-3xl mt-7">
        {formattedEvents[0]?.name
          ? 'Buy a ticket for one of these upcoming concerts !'
          : 'No decentralized concert available for the moment ...'}
      </h2>
      <div className="flex flex-row flex-wrap justify-between mx-8">
        {formattedEvents[0]?.name &&
          formattedEvents.map((event, index) => (
            <div
              key={index}
              onClick={() => {
                setOpenModal(true)
                setTicketToOpen(index)
                setTicketToBuyId(+event.ticketIdToBuy)
              }}
              style={{ width: 500 }}
            >
              <TicketTemplate event={event} />
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
          setOpenTransactionModalDone(false)
          setOpenTransactionFailedModal(false)
        }}
      />
      <div className="modal">
        <div className="modal-box flex items-center flex-col modal-box w-9/12 max-w-5xl">
          {openTransactionModalDone ? (
            !openTransactionFailedModal ? (
              <>
                <h3 className="font-bold text-2xl text-center mb-4 text-white">
                  Congratulations on your purchase 🥳 🎉 !
                </h3>
                <img
                  className="w-80"
                  src={`https://media.tenor.com/aKFaZBrZFYcAAAAC/excited-spin.gif`}
                  alt=""
                />
                <p className="mr-4 mt-7 text-justify text-white">
                  Congratulations! Your ticket is now available and can be used
                  to access the event.
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
                  Look at the error in the console for more details, and try
                  again later
                </p>
                <div className="modal-action">
                  <label htmlFor="my-modal" className="btn">
                    Try later ... 😕
                  </label>
                </div>
              </>
            )
          ) : (
            <>
              <h3 className="font-bold text-2xl text-center mb-4 text-white">
                It's time for you 🤯 !
              </h3>

              {formattedEvents[0]?.name && (
                <TicketTemplate event={formattedEvents[ticketToOpen]} />
              )}
              {transactionInProgress ? (
                <div className="mt-5 w-1/3 bg-primary h-12 rounded-lg flex justify-center items-center">
                  <progress className="progress progress-secondary w-9/12"></progress>
                </div>
              ) : (
                <div className="modal-action">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      buyTicket()
                    }}
                  >
                    Buy this ticket 🚀 !
                  </button>
                  <button
                    onClick={() => setOpenModal(false)}
                    className="btn ml-10"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
