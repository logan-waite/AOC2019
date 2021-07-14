const tools = require('../tools.js')
const R = require('ramda')

const getWirePaths = R.pipe(
  tools.splitString(/\n/),
  R.map(tools.splitString(','))
)

const map2Loop = (func, list1, list2, i, result) => {
  if (i === list1.length || i === list2.length) {
    return result
  } else {
    const funcResult = func(list1[i], list2[i])
    return map2Loop(func, list1, list2, i + 1, R.append(funcResult, result))
  }

}

// map2 : (a -> b -> result) -> List a -> List b -> List result
const map2 = R.curry((func, list1, list2) => {
  return map2Loop(func, list1, list2, 0, [])
})

const generateCoords = R.curry((pastMoves, move) => {
  const direction = R.head(move)
  const distance = parseInt(R.tail(move))
  const lastPosition = R.last(pastMoves)

  switch (direction) {
    case 'U':
      return R.append(R.update(1, lastPosition[1] + distance, lastPosition), pastMoves)
    case 'D':
      return R.append(R.update(1, lastPosition[1] - distance, lastPosition), pastMoves)
    case 'R':
      return R.append(R.update(0, lastPosition[0] + distance, lastPosition), pastMoves)
    case 'L':
      return R.append(R.update(0, lastPosition[0] - distance, lastPosition), pastMoves)
    default:
      return start
  }
})

const findLine = R.curry((direction, wire, index, list) => {
  if (wire[index] === undefined) {
    return list
  } else {
    const dir = direction === 'x' ? 0 : 1
    return R.pipe(
      R.ifElse(
        () => wire[index - 1][dir] === wire[index][dir],
        R.append([wire[index - 1], wire[index]]),
        R.identity
      ),
      findLine(direction, wire, index + 1)
    )(list)
  }
})

const getHorizontalLines = findLine('x')
const getVerticalLines = findLine('y')

function findIntersections (vLines, hLines) {
  return R.unnest(R.map(
    (v) => {
      return R.reduce(
        (intersections, h) => {
          const compareX = (point) => point[0]
          const compareY = (point) => point[1]
          // console.log("*", v, h)
          isVXBetweenHXs = v[0][0] < R.maxBy(compareX, h[0], h[1])[0] && v[0][0] > R.minBy(compareX, h[0], h[1])[0]
          isHYBetweenVYs = h[0][1] < R.maxBy(compareY, v[0], v[1])[1] && h[0][1] > R.minBy(compareY, v[0], v[1])[1]
          if (isVXBetweenHXs && isHYBetweenVYs) {
            return R.append([v[0][0], h[0][1]], intersections)
          } else {
            return intersections
          }
        },
        [],
        hLines
      )
    },
    vLines
  ))
}

const findManhattanDistance = R.pipe(
  R.map(Math.abs),
  R.sum
)

function getWireIntersections (wire1, wire2) {
  const x1 = getHorizontalLines(wire1, 1, [])
  const x2 = getHorizontalLines(wire2, 1, [])
  const y1 = getVerticalLines(wire1, 1, [])
  const y2 = getVerticalLines(wire2, 1, [])

  return R.concat(findIntersections(x1, y2), findIntersections(x2, y1))
}

function part1 (data) {
  const wirePaths = getWirePaths(data)
  const wire1 = R.reduce(generateCoords, [[0, 0]], wirePaths[0])
  const wire2 = R.reduce(generateCoords, [[0, 0]], wirePaths[1])
  const intersections = getWireIntersections(wire1, wire2)

  const distances = R.map(findManhattanDistance, intersections)
  return Math.min(...distances)
}

const generateIntermediateCoords = R.curry((start, end, list) => {
  const last = R.last(list)
  const axis = start[0] === end[0] ? 1 : 0
  const change = start[axis] - end[axis] < 0 ? last[axis] + 1 : last[axis] - 1
  if (last[axis] !== end[axis]) {
    const next = R.update(axis, change, last)
    const updatedList = R.append(next, list)
    return generateIntermediateCoords(start, end, updatedList)
  } else {
    return list
  }
})

function stepsToFirstIntersection (intersections, steps, index, wire) {
  const path = generateIntermediateCoords(wire[index], wire[index + 1], [wire[index]])
  const results = intersections.filter(value => R.contains(value, path))
  if (results.length > 0) {
    return steps;
  } else {
    return stepsToFirstIntersection(intersections, steps + path.length, index + 1, wire)
  }
}

function stepsToIntersection (intersection, steps, index, wire) {
  const path = generateIntermediateCoords(wire[index], wire[index + 1], [wire[index]])
  if (R.contains(intersection, path)) {
    return steps + R.indexOf(intersection, path);
  } else {
    return stepsToIntersection(intersection, steps + (path.length - 1), index + 1, wire)
  }
}

function getClosestIntersection (intersections, wire1, wire2) {
  const checkIntersection = R.curry((wire1, wire2, intersection) => {
    const wire1Steps = stepsToIntersection(intersection, 0, 0, wire1)
    const wire2Steps = stepsToIntersection(intersection, 0, 0, wire2)
    return wire1Steps + wire2Steps;
  })
  const distances = R.map(checkIntersection(wire1, wire2), intersections)
  return R.head(R.sort((a, b) => a - b, distances));
}

function part2 (data) {
  const wirePaths = getWirePaths(data);
  const wire1 = R.reduce(generateCoords, [[0, 0]], wirePaths[0])
  const wire2 = R.reduce(generateCoords, [[0, 0]], wirePaths[1])
  const intersections = getWireIntersections(wire1, wire2)

  const result = getClosestIntersection(intersections, wire1, wire2);

  return result
}

// tools.test(3, part1, part2)
tools.run(3, part1, part2)