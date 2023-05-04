import env from '@config/env.config'
import chalk from 'chalk'

class Logger {
  prefix = `[${env.appName}]:`
  debug = (msg: string) => console.debug(chalk.yellow(`${this.prefix} ${msg}`))
  log = (msg: string) => console.log(chalk.blue(`${this.prefix} ${msg}`))
  warn = (msg: string) => console.warn(chalk.hex('#FFA500')(`${this.prefix} ${msg}`))
  error = (msg: string) => console.error(chalk.bold.red(`${this.prefix} ${msg}`))
}

const logger = new Logger()

export default logger
