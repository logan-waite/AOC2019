const tools = require('../tools.js')
const R = require('ramda')

const convertNumberToArray = R.pipe(
  R.toString,
  R.split(''),
  R.map(parseInt)
)

function checkPassword (numArray, hasDouble, index) {
  const nextIndex = index + 1
  if (nextIndex >= numArray.length) {
    return hasDouble
  } else if (numArray[index] > numArray[nextIndex]) {
    return false
  } else {
    const newHasDouble = hasDouble || numArray[index] === numArray[nextIndex]
    return checkPassword(numArray, newHasDouble, nextIndex)
  }
}

function isPasswordValid (password) {
  const splitNums = convertNumberToArray(password)
  return checkPassword(splitNums, false, 0)
}


function part1 (data) {
  const range = tools.splitInt('-')(data)
  const possiblePasswords = R.range(range[0], range[1] + 1)
  return R.filter(isPasswordValid, possiblePasswords).length
}

function passwordFilter2 (password) {
  const splitNums = convertNumberToArray(password)
  const counts = R.reduce((acc, elem) => { acc[elem] = acc[elem] ? acc[elem] + 1 : 1; return acc }, {}, splitNums)
  return R.contains(2, R.values(counts))
}

function part2 (data) {
  const range = tools.splitInt('-')(data)
  const possiblePasswords = R.range(range[0], range[1] + 1)
  const filtered = R.filter(isPasswordValid, possiblePasswords)

  return R.filter(passwordFilter2, filtered).length;
}

// tools.test(4, part1)
tools.run(4, part1, part2)