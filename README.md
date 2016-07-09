Node REPL
=========

A simple customizable REPL for NodeJS.

Example:

``ts
const repl = class extends REPL {
  evaluate(input: string) {
    console.log(input.toUpperCase())
  } 
}
```

## Built-in commands

When creating a new REPL, a few commands are already defined:

### stack

Print the stack trace of the last caught error.

### alias [origname] [newname]

Creates an alias for the given command.

### quit

Stop the running process.

