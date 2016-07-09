
/// <reference path="typings/index.d.ts" />

import * as chalk from "chalk"
import * as readline from "readline"

function error(msg: string) {
  console.log(chalk.red(`Error: ${msg}`))
}

export class REPL {

  rl;
  lastError: Error | null = null

  constructor(options?) {
    options = options || {}
  }

  start() {
    if (this.rl)
      throw new Error(`REPL already started`)
    this.rl = readline.createInterface({
      input: process.stdin
    , output: process.stdout
    })
    const read = async () => {
      this.rl.question(' > ', (answer) => {
        switch (answer) {
        case 'stack':
          if (this.lastError === null)
            error('No recent errors.')
          else
            console.log(this.lastError.stack)
          read()
          break
        default:
          this.evaluate(answer)
            .then(() => read())
            .catch(e => {
              this.lastError = e
              error(e.message)
              read()
            })
        }
      })
    }
    read().catch(e => error(e.stack))
  }

  stop() {
    if (!this.rl)
      throw new Error(`REPL not started`)
    this.rl.close()
  }

  abstract evaluate(input: string): Promise<void>

  addREPL(name: string, repl: REPL) {
    this.addCommand(name, (argv) => {
      return repl.evaluate(argv)
    })
  }

}

