
import { REPL } from "./index"

const repl = new class extends REPL {
  evaluate(input: string) {
    console.log(`You typed: ${input.toUpperCase()}`)
  }
}

repl.start()

