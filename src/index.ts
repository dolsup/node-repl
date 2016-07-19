
/// <reference path="../typings/index.d.ts" />

import { EventEmitter } from "events"
import * as chalk from "chalk"
import * as readline from "readline"

function error(msg: string) {
  console.log(chalk.red(`Error: ${msg}`))
}

function isPromise(val) {
  return (typeof val === 'object' || typeof val === 'function') && typeof val.then !== undefined
}

export abstract class REPL extends EventEmitter {

  enableBuiltins: boolean
  shortErrors: boolean
  lastError: Error | null = null
  aliases: { [name: string]: string }
  private stopRequested: boolean
  evaluators = []
  
  printError(e) {
    if (this.shortErrors)
      error(e.message)
    else
      console.log(e.stack)
  }

  handleError(e) {
    this.lastError = e
    this.printError(e)
    this.emit('errorCaught', e)
  }

  constructor(options?) {
    super()
    options = options || {}
    this.enableBuiltins = options.builtins === undefined ? true : !!options.builtins
    this.shortErrors = options.shortErrors === undefined ? true : !!options.shortErrors
  }

  use(evaluator) {
    this.evaluators.push(evaluator)
  }

  start() {
    const read = () => {
      if (this.stopRequested) {
        this.stopRequested = false
        return
      }
      const rl = readline.createInterface({
        input: process.stdin
      , output: process.stdout
      })
      const stopRL = () => rl.close()
      this.on('stop', stopRL)
      rl.question(' > ', (answer) => {
        this.removeListener('stop', stopRL)
        rl.close()
        const chunks = answer.split(' ')
            , command = chunks[0]
            , ev = () => {
                this.evaluate(answer)
                  .then(() => read())
                  .catch(e => {
                    this.handleError(e)
                    read()
                  })
              }
        if (this.enableBuiltins) {
          switch (command) {
          case 'stack':
            if (this.lastError === null)
              error('No recent errors.')
            else
              console.log(this.lastError.stack)
            read()
            break
          case 'quit':
            this.stop()
            break
          default:
            ev()
          }
        } else
          ev()
      })
    }
    read()
  }

  evaluate(input: string) {
    if (this.evaluators.length === 0)
      throw new Error(`no evaluator defined`)
    return new Promise((accept, reject) => {
      const ev = (index, input) => {
        if (index === this.evaluators.length)
          accept(input)
        else {
          const res = this.evaluators[index].evaluate(input)
          if (isPromise(res))
            res
              .then(output => ev(++index, output))
              .catch(reject)
          else
            ev(++index, res)
        }
      }
      ev(0, input)
    })
  }

  stop() {
    this.stopRequested = true
    this.emit('close')
  }

}

