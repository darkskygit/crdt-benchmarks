import { YoctoFactory } from './factory.js'
import { runBenchmarks, writeBenchmarkResultsToFile } from '../../js-lib/index.js'
;(async () => {
	await runBenchmarks(new YoctoFactory(), (testName) => !testName.startsWith('[B4x100') && !testName.startsWith('[B3.3'))
	writeBenchmarkResultsToFile('../results.json', (testName) => true)
})()
