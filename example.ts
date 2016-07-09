
import { REPL } from "./index"

const repl = new class extends REPL {
  constructor() {
    super({ 
      noBuiltins: false
    })
  }
  async evaluate(input: string) {
    console.log(input.toUpperCase())
  }
}

repl.start()

