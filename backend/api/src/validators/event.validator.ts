import { IEventValidator } from '@interfaces/validator.interface'
import { AppValidator } from './app.validator'

class EventValidator extends AppValidator implements IEventValidator {}

const eventValidator = new EventValidator()

export default eventValidator
