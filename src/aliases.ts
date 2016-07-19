
import * as micromatch from "micromatch"

class AliasEvalutator {

  aliases: Map


  addAlias(pattern: string, result: string) {
    if (this.aliases.has(pattern))
      throw new Error(`alias '${pattern}' already defined`)
    this.aliases.set(pattern, result)
  }

  constructor(aliases) {
    this.aliases = new Map(aliases || {})
  }

  evaluate(input: string) {
    for (const pair of this.aliases) {
      const matches = micromatch(pair[0])
      if (matches.length > 0) {
        return pair[1]
      }
    }
    return input
  }
}

