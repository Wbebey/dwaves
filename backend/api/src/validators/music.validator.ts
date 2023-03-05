import { IMusicValidator } from '@interfaces/validator.interface'
import { AppValidator } from '@validators/app.validator'

class MusicValidator extends AppValidator implements IMusicValidator {}

const musicValidator = new MusicValidator()

export default musicValidator
