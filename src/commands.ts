
import * as _ from "lodash"
import * as minimist from "minimist"

export class CommandEvaluator {

  commands: Object

  constructor(commands) {
    this.commands = commands || {}
  }

  isDefined(path: string) {
    return _.has(this.commands, path)
  }

  hasCommand(path: string) {
    return _.has(this.commands, path) && typeof _.get(this.commands, path) === 'function'
  }

  hasCommands(path: string) {
    return _.has(this.commands, path) && _.isPlainObject(_.get(this.commands, path))
  }

  addCommand(path: string, callback) {
    if (_.has(this.commands, path))
      throw new Error(`command on '${path}' already taken`)
    _.set(this.commands, path, callback)
  }

  addCommands(commands) {
    _.forEach(this.commands, (callback, path) => {
      this.addCommand(path, callback)
    })
  }
  
  async evaluate(input: string) {
    const argv = minimist(input.split(' '))
    let node = this.commands
    while (typeof node !== 'function') {
      if (node === undefined || Object.keys(node).length === 0)
        throw new Error(`command not found`)
      if (argv._.length === 0) {
        console.log('Available commands:')
        for (const key of Object.keys(node))
          console.log(` - ${key}`)
        return input
      }
      node = node[argv._[0]]
      argv._.shift()
    }
    await node(argv)
    return input
  }
}

