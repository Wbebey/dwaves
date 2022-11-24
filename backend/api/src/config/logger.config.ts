import env from '@config/env.config'
import chalk from 'chalk'
class Logger {
  prefix = `[${env.appName}]:`
  debug = (msg: string | Object) => console.debug(chalk.yellow(`${this.prefix} ${parseMsg(msg)}`))
  log = (msg: string | Object) => console.log(chalk.blue(`${this.prefix} ${parseMsg(msg)}`))
  warn = (msg: string | Object) => console.warn(chalk.hex('#FFA500')(`${this.prefix} ${parseMsg(msg)}`))
  error = (msg: string | Object) => console.error(chalk.bold.red(`${this.prefix} ${parseMsg(msg)}`))
}

const parseMsg = (msg: string | Object) => {
  try {
    return msg instanceof Object ? JSON.stringify(msg) : JSON.parse(msg)
  } catch {
    return msg
  }
}

const logger = new Logger()

export default logger
