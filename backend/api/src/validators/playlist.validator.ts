import { IPlaylistValidator } from '@interfaces/validator.interface'
import { AppValidator } from '@validators/app.validator'

class PlaylistValidator extends AppValidator implements IPlaylistValidator {}

const playlistValidator = new PlaylistValidator()

export default playlistValidator
