const tools = require('../tools.js')
const R = require('ramda')

const compute = R.curry((opIndex, list) => {
  if (opIndex === undefined) {
    return list
  }
  const position = opIndex + 3
  const index1 = list[opIndex + 1]
  const index2 = list[opIndex + 2]

  switch (list[opIndex]) {
    case 1:
      return R.pipe(
        R.update(list[position], list[index1] + list[index2]),
        compute(opIndex + 4)
      )(list)

    case 2:
      return R.pipe(
        R.update(list[position], list[index1] * list[index2]),
        compute(opIndex + 4)
      )(list)
    default:
      return list
  }
})



function runComputer (input1, input2, program) {
  const updatedProgram = R.pipe(
    R.update(1, input1),
    R.update(2, input2)
  )(program)
  return compute(0, updatedProgram)[0];
}

// This solution from https://github.com/AlisCode/aoc19/blob/master/src/day2.rs
/// On the Reddit thread for solutions (https://www.reddit.com/r/adventofcode/comments/e4u0rw/2019_day_2_solutions/)
/// we can see that a constraint solver (z3) simplifies this problem as solving 19690720 = c1 + c2*v + n
/// where c1 and c2 will vary (since they depend on your input).
function getInputsForOutput (data, output) {
  // The first step is to find c1 and c2. In order to do this, we need to solve the program for known verb and noun.
  // Here, we'll solve for two cases:
  // * v = 12 and n = 2,
  // * v = 13 and n = 2
  //
  // This will give us two results: r1 and r2. We then have the system such as :
  // { r1 = c1 + c2 * 12 + 2
  // { r2 = c1 + c2 * 13 + 2
  const r1 = runComputer(12, 2, data)
  const r2 = runComputer(13, 2, data)
  // Simplifying this system gives us
  // { c1 = 13 * r1 - 12 * r2 - 2
  // { c2 = r2 - r1
  const c1 = 13 * r1 - 12 * r2 - 2;
  const c2 = r2 - r1;

  // We then need to solve the following equation :
  // 19690720 = c1 + c2 * v + n
  // ==> 196960720 - c1 = c2 * v + n
  // The most straightforward solution is then to use the euclidean division.
  const val = output - c1;
  const input1 = Math.floor(val / c2)
  const input2 = val % c2
  return [input1, input2]
}

function solve1 (data) {
  const input = tools.splitInt(',')(data)
  return runComputer(12, 2, input)
}



function solve2 (data) {
  const input = tools.splitInt(',')(data)
  const inputSet = getInputsForOutput(input, 19690720)
  return 100 * inputSet[0] + inputSet[1]
}

// tools.test(2, solve1)
tools.run(2, solve1, solve2)