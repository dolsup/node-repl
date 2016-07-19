
import * as _ from "lodash"

export class EvaluationProfiler {

  times = []
  startTime: number
  currentInput: string

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
        profiler.times.push({
          delta: endTime - profiler.startTime
        , input: profiler.currentInput
        })
        return input
      }
    }
  }

}

