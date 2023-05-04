import { ConcertEvent } from '@@types/event.type'
import { IEventController } from '@interfaces/controller.interface'
import nftService from '@services/nft.service'
import { RequestHandler } from 'express'

class EventController implements IEventController {
  createConcertEvent: RequestHandler = async (req, res) => {
    const { address, username } = req.app.locals.user
    const { name, date, location, genre, ticketCount, ticketPrice } = req.body

    const concertEvent = {
      artistAddress: address,
      name,
      date: Date.parse(date),
      location,
      genre,
      artistName: username,
      ticketCount,
      ticketPrice,
      ticketSold: 0,
    } satisfies ConcertEvent

    const tx = await nftService.createConcertEvent(concertEvent)

    console.log({ tx })

    res.json(tx)
  }

  buyTicket: RequestHandler = async (req, res) => {
    const { address } = req.app.locals.user
    const { ticketId } = req.body

    const tx = await nftService.buyTicket(address, ticketId)

    console.log({ tx })

    res.json(tx)
  }
}

const eventController = new EventController()

export default eventController
