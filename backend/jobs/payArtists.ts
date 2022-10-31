import { HttpFunction } from '@google-cloud/functions-framework'

export const payArtists: HttpFunction = (req, res) => {
  res.send('Hello, World')
}
