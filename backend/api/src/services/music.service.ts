import { MusicFilter, ViewMusic, ViewMusicDetail } from '@@types/pinata.type'
import { IMusicService } from '@interfaces/service.interface'
import genreService from './genre.service'
import pinataService from './pinata.service'
import userService from './user.service'
import albumService from '@services/album.service'

class MusicService implements IMusicService {
  getPopularMusics = async (
    musicFilter: MusicFilter,
    limit?: number
  ): Promise<ViewMusicDetail[]> => {
    const { genre, artistId } = musicFilter
    const musics = await pinataService.getMusicFromIPFS({ genre, artistId })
    const popularMusics = musics
      .sort((a, b) => b.listenings - a.listenings)
      .slice(0, limit || 10)

    //* Don't parallelize promises to not instantiate too many db connections
    const viewMusics = []
    for await (const music of popularMusics.map(this.toViewMusic)) {
      viewMusics.push(music)
    }

    return viewMusics
  }

  toViewMusic = async (music: ViewMusic): Promise<ViewMusicDetail> => {
    const [artist, genre, album] = await Promise.all([
      userService.findUnique({ id: music.artistId }),
      genreService.findUnique({ id: music.genreId }),
      albumService.findUnique({ id: music.albumId }),
    ])

    return {
      ...music,
      artist: artist?.username || 'Unknown',
      genre: genre?.name || 'Unknown',
      albumName: album?.name || 'Unknown',
      albumCover: album?.cover || 'Unknown',
      albumDate: album?.createdAt || 'Unknown',
    }
  }
}

const musicService = new MusicService()

export default musicService
