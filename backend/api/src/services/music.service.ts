import { MusicFilter, ViewMusic } from '@@types/pinata.type'
import { IMusicService } from '@interfaces/service.interface'
import genreService from './genre.service'
import pinataService from './pinata.service'
import userService from './user.service'

class MusicService implements IMusicService {
  getPopularMusics = async (
    musicFilter: MusicFilter,
    limit?: number
  ): Promise<ViewMusic[]> => {
    const { genre, artistId } = musicFilter
    const musics = await pinataService.getMusicFromIPFS({ genre, artistId })
    const popularMusics = musics
      .sort((a, b) => b.listenings - a.listenings)
      .slice(0, limit || 10)

    //* Don't parallelize promises to not instantiate too many db connections
    const viewMusics = []
    for await (const music of popularMusics.map(this._toViewMusic)) {
      viewMusics.push(music)
    }

    return viewMusics
  }

  private _toViewMusic = async (music: ViewMusic) => {
    const [artist, genre] = await Promise.all([
      userService.findUnique({ id: music.artistId }),
      genreService.findUnique({ id: music.genreId }),
    ])

    return {
      ...music,
      artist: artist?.username || 'Unknown',
      genre: genre?.name || 'Unknown',
    }
  }
}

const musicService = new MusicService()

export default musicService
