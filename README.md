Node REPL
=========

A extensible and customizable REPL for NodeJS. Features command tree evaluation, aliases and profiling.

Example:

```ts
import { REPL } from "repl-cli"
const repl = new REPL()
repl.use({
  evaluate(input) {
    console.log(input.toUpperCase()
  }
})
repl.start()
```

## Events

### errorCaught

The REPL caught an error while running one of its evaluators.

### close

The REPL was closed.

## Options

```js
new REPL(options)
```

### options.builtins

Set to true to disable the built-in commands (see below). Defaults to true.

### options.shortErrors

Set true to hide the stack error trace when an error was caught by the
REPL. Defaults to true.

## Methods

### start()

Starts a new REPL using the current standard input and output.

### stop()

Stops the REPL, allowing it to finish execution of the last command entered.

## Built-in commands

:warning: **Deprecated**: this will soon be removed from the core

When creating a new REPL, a few commands are already defined:

### stack

Print the stack trace of the last caught error.

### quit

Stop the running process.

## Evaluation Middlewares

### Alias evaluator

This middleware adds support for aliases to your REPL. Add this **before** you add any other evaluation processing that wants to take advantage of this feature.

**Note:** you must define your own instructions for letting your users add aliases.

```ts
import { AliasEvaluator } from "repl-cli/lib/aliases"

const aliases = new AliasEvaluator({
  foo: "bar --baz -n 1
})

repl.use(aliases)
```

### Command evaluator

Allows nested commands in your application.

```ts
import { CommandEvaluator } from "repl-cli/lib/commands"

const commands = new CommandEvaluator({
  test: {
    console.log('It works!')
  }
})

repl.use(commands)
```

#### addCommand(path, callback, scope?)

Adds callback to the command tree on the specified `path`, optionally bound to
`scope`.

#### removeCommand(path, callback, scope?)

Removes a command from the command tree on the specified path, and optionally
from the specified `scope`.  If scope was specified and was disabled, will not
attempt to remove it from the command tree.

#### enableScope(name)

Enables the scope specified by `name`, meaning that any commands bound to the
scope `name` will be activated.

#### disableScope(name)

De-activates any command bound to scope `name`.

### Profiler

Profiles evaluation of the specified evaluators, in milliseconds.

```ts
import { EvaluationProfiler } from "repl-cli/lib/profiling"

const profiler = new EvaluationProfiler({
  displayResults: true
})
repl.use(profiler.start())
// add your evaluators here
repl.use(profiler.end())
```

#### new EvaluationProfiler(options)

 - **displayResults**: true to to let the profiler automatically flush results to the end user. Defaults to false.

