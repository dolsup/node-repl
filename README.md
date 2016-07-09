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

