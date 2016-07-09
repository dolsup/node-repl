
/// <reference path="typings/index.d.ts" />

import * as chalk from "chalk"
import * as readline from "readline"

function error(msg: string) {
  console.log(chalk.red(`Error: ${msg}`))
}

function isPromise(val) {
  return val instanceof Object && typeof val.then === 'function'
}

export abstract class REPL {

  byeMessage = 'Bye.'
  rl;
  lastError: Error | null = null
  aliases: { [name: string]: string }

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
        try { 
          const chunks = answer.split(' ')
              , command = chunks[0]
          switch (command) {
          case 'stack':
            if (this.lastError === null)
              error('No recent errors.')
            else
              console.log(this.lastError.stack)
            read()
            break
          case 'quit':
            console.log(this.byeMessage)
            process.exit()
          case 'alias':
            const aliasName = chunks[1]
            if (!aliasName)
              throw new Error(`must provide an alias name`)
            if (chunks.length < 3)
              throw new Error(`must provide a command`)
            this.aliases[aliasName] = chunks.slice(2).join(' ')
            console.log(chalk.green(`Alias '${aliasName}' created.`))
            break
          default:
            const res = this.evaluate(answer)
            if (isPromise(res))
              res.then(() => read())
                .catch(e => {
                  this.lastError = e
                  error(e.message)
                  read()
                })
          }
        } catch (e) {
          this.lastError = e
          error(e.message)
          read()
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

}

