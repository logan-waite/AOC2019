const tools = require('../tools.js')
const R = require('ramda')

// Divide by 3, round down, subtract 2
const calculateFuel = R.pipe(
  R.divide(R.__, 3),
  Math.floor,
  R.subtract(R.__, 2),
)

function solve1 (data) {
  const input = tools.splitInt(/\n/, data)

  const calculateReqs = (acc, mass) => {
    return acc + calculateFuel(mass)
  }

  return R.reduce(calculateReqs, 0, input)
}

function solve2 (data) {
  const input = tools.splitInt(/\n/, data)

  const calculateFuelRecursively = (mass) => {
    const fuel = calculateFuel(mass)
    return fuel > 0 ? fuel + calculateFuelRecursively(fuel) : 0
  }

  const calculateTotalReqs = (acc, mass) => {
    const fuel = calculateFuel(mass)
    const fueledFuel = calculateFuelRecursively(fuel)
    return acc + fuel + fueledFuel
  }

  return R.reduce(calculateTotalReqs, 0, input)
}

tools.run(1, solve1, solve2)
