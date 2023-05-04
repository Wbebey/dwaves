import { IAlbumValidator } from '@interfaces/validator.interface'
import { AppValidator } from './app.validator'

class AlbumValidator extends AppValidator implements IAlbumValidator {}

const albumValidator = new AlbumValidator()

export default albumValidator
