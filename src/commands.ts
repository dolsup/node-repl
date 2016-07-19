
import * as _ from "lodash"
import * as minimist from "minimist"
import * as flattenObject from "flat"

export class CommandEvaluator {

  commands: Object
  scopes: { [name: string]: {
    commands: Object
    enabled: boolean
  } } = {}

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

  private registerCommand(path, callback) {
    if (_.has(this.commands, path))
      throw new Error(`command '${path}' already taken`)
    _.set(this.commands, path, callback)
  }

  private unregisterCommand(path) {
    if (!_.has(this.commands, path))
      throw new Error(`command '${path}' not found`)
    _.unset(this.commands, path)
  }

  addCommand(path: string, callback, scopeName: string) {
    if (scopeName !== undefined) {
      if (this.scopes[scopeName] === undefined)
        this.scopes[scopeName] = { commands: {}, enabled: true }
      const scope = this.scopes[scopeName]
      if (_.has(scope.commands, path)) 
        throw new Error(`command '${path}' already taken`)
      _.set(scope.commands, path, callback)
    }
    if (scopeName === undefined || this.scopes[scopeName].enabled)
      this.registerCommand(path, callback)
  }

  removeCommand(path: string, scopeName) {
    if (scopeName !== undefined && this.scopes[scopeName] !== undefined) {
      const scope = this.scopes[scopeName]
      if (!_.has(scope.commands, path))
        throw new Error(`command '${path}' not found`)
      _.unset(this.scopes[scopeName].commands, path)
    }
    if (scopeName === undefined || this.scopes[scopeName] && this.scopes[scopeName].enabled)
      this.unregisterCommand(path)
  }

  addCommands(commands, scope) {
    _.forEach(flattenObject(commands), (callback, path) => {
      this.addCommand(path, callback, scope)
    })
  }
 
  enableScope(name: string) {
    const scope = this.scopes[name]
    if (scope === undefined) {
      this.scopes[name] = { commands: {}, enabled: true } 
      return
    }
    if (scope.enabled)
      return
    _.forEach(flattenObject(scope.commands), (callback, path) => {
      this.registerCommand(path, callback)
    })
    scope.enabled = true
  }

  disableScope(name: string) {
    const scope = this.scopes[name]
    if (scope === undefined) {
      this.scopes[name] = { commands: {}, enabled: false }
      return
    }
    if (!scope.enabled)
      return
    _.forEach(flattenObject(scope.commands), (callback, path) => {
      this.unregisterCommand(path, callback, name)
    })
    scope.enabled = false
  }

  protected printNodeHelp(node) {
    console.log('Available commands:')
    for (const key of Object.keys(node))
      console.log(` - ${key}`)
  }

  printHelp(path: string) {
    if (!_.has(this.commands, path))
      throw new Error(`command '${path}' does not exist`)
    const node = _.get(this.commands, path)
    if (!_.isPlainObject(node))
      throw new Error(`no help avaialble about command`)
    this.printNodeHelp(_.get(this.commands, path))
  }

  async evaluate(input: string) {
    const argv = minimist(input.split(' '))
    let node = this.commands
    while (typeof node !== 'function') {
      if (node === undefined || Object.keys(node).length === 0)
        throw new Error(`command not found`)
      if (argv._.length === 0) {
        this.printNodeHelp(node)
        return input
      }
      node = node[argv._[0]]
      argv._.shift()
    }
    await node(argv)
    return input
  }

}

