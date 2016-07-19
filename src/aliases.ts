
import * as _ from "lodash"
import * as micromatch from "micromatch"

export class AliasEvaluator {

  aliases: Map<string, string>

  addAlias(pattern: string, result: string) {
    if (this.aliases.has(pattern))
      throw new Error(`alias '${pattern}' already defined`)
    this.aliases.set(pattern, result)
  }

  constructor(aliases?) {
    this.aliases = new Map()
    _.forEach(aliases, (result, pattern) => {
      this.addAlias(pattern, result)
    })
  }

  evaluate(input: string) {
    for (const pair of this.aliases) {
      const matches = micromatch(input, pair[0])
      if (matches.length > 0) {
        return pair[1]
      }
    }
    return input
  }
}

