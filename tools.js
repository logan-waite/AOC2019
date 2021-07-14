const fs = require('fs')
const path = require('path')
const R = require('ramda')

const logger = R.curry((color, string) => {
  console.log(`${color}%s\x1b[0m`, string)
})

const logRed = logger("\x1b[31m")

const logYellow = logger("\x1b[33m")

const logGreen = logger("\x1b[32m")

brighten = (string) => `\x1b[1m${string}\x1b[0m`
dim = (string) => `\x1b[2m${string}\x1b[0m`

function runTests (part, testFunc, testData) {
  return R.map((test) => {
    const result = testFunc(test.initial)
    const expected = test.expected[`part${part}`]
    if (result === expected) {
      logGreen("Test Passed!")
      return true;
    } else {
      logYellow("\nTest Failed!")
      console.log(dim("Expected: "), expected)
      console.log(dim("Actual: "), result)
      console.log("\n---------")
      return false;

    }

  }, testData)
}

module.exports = {
  test: function (day, part1, part2) {
    const filePath = path.join(__dirname, './Day' + day + '/tests.json')
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (!err) {
        const testData = JSON.parse(fs.readFileSync(filePath))
        if (part1 === undefined && part2 === undefined) {
          logRed("We need at least one function to work")
        }
        if (part1 !== undefined) {
          console.log(brighten("\n**** Testing Part 1 ****"))
          const results = runTests(1, part1, testData)

          console.log(`\nPart 1 tests: ${R.length(R.filter((r) => r, results))}/${testData.length} passed`)
        }
        if (part2 !== undefined) {
          console.log(brighten("\n**** Testing Part 2 ****"))
          const results = runTests(2, part2, testData)

          console.log(`\nPart 2 tests: ${R.length(R.filter((r) => r, results))}/${testData.length} passed`)
        }
      } else {
        logRed(`Unable to find 'tests.json' at ${filePath}.`)
      }
    })
  },
  run: function (day, part1, part2) {
    const filePath = path.join(__dirname, './Day' + day + '/input.txt');

    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
      if (!err) {
        if (part1 === undefined && part2 === undefined) {
          console.error("We need at least one function to work");
        }
        console.log("**************")
        if (part1 !== undefined) {
          console.log("\nDay " + day + " Part 1 result:")
          console.log(part1(data))
        }
        if (part2 !== undefined) {
          console.log("\nDay " + day + " Part 2 result:")
          console.log(part2(data))
        }
        console.log("\n")
        console.log("**************")
      } else {
        console.log(err);
      }
    });
  },
  // splitInt: R.curry((splitter) => R.split(splitter)),
  splitInt: R.curry((splitter) => R.pipe(
    R.split(splitter),
    R.map(parseInt)
  )),
  splitString: R.curry((splitter) => R.split(splitter))
}