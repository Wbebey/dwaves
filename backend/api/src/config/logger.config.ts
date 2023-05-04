import chalk from 'chalk'

class Logger {
  debug = (msg: string) => console.debug(chalk.yellow(msg))
  log = (msg: string) => console.log(chalk.blue(msg))
  warn = (msg: string) => console.warn(chalk.hex('#FFA500')(msg))
  error = (msg: string) => console.error(chalk.bold.red(msg))
}

const logger = new Logger()

export default logger
