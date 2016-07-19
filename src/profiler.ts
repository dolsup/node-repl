
import * as _ from "lodash"

export class EvaluationProfiler {

  times = []
  startTime: number
  currentInput: string
  displayResults: boolean

  constructor(options?) {
    options = options || {}
    this.displayResults = options.displayResults === undefined ? true : options.displayResults
  }

  average(input: string) {
    const instances = this.times.filter(data => data.input === input)
    return _.reduce(instances, (res, data) => res + data.delta) / instances.length
  }

  start() {
    const profiler = this
    return new class {
      evaluate(input: string) {
        profiler.startTime = Date.now()
        return input
      }
    }
  }

  end() {
    const profiler = this
    return new class {
      evaluate(input: string) {
        const endTime = Date.now()
            , delta = endTime - profiler.startTime
        profiler.times.push({
          delta: delta
        , input: profiler.currentInput
        })
        if (profiler.displayResults)
          console.log(`Command took ${delta} miliseconds to execute.`)
        return input
      }
    }
  }

}

