Node REPL
=========

A simple customizable REPL for NodeJS.

Example:

```ts
import { REPL } from "repl-cli"
const repl = new REPL()
repl.use(input => { console.log(input.toUpperCase() })
repl.start()
```

## Options

```js
new REPL(options)
```

### options.byeMessage

The message to be displayed when the user quits the REPL. Defaults to `Bye.`.

### options.builtins

Set to true to disable the built-in commands (see below). Defaults to true.

### options.shortErrors

Set true to hide the stack error trace when an error was caught by the
REPL. Defaults to true.

## Built-in commands

When creating a new REPL, a few commands are already defined:

### stack

Print the stack trace of the last caught error.

### alias [oldname] [newname]

Creates an alias for the given command.

### quit

Stop the running process.

## Evaluators

### Command evaluator

```
import { commandEvaluator } from "repl-cli/commands"

const commands = {
  test: {
    console.log('It works!')
  }
}

repl.use(commandEvaluator(commands))
```

