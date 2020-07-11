const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter

const cellsHorizontal = 16
const cellsVertical = 9
const width = window.innerWidth
const height = window.innerHeight
const borderWeight = 5
const edgeWeight = 3

const unitLengthX = width / cellsHorizontal
const unitLengthY = height / cellsVertical

const wallColor = '#53354a'
const ballColor = '#e84545'
const goalColor = '#903749'

const engine = Engine.create()
engine.world.gravity.y = 0
const { world } = engine
const render = Render.create({
  element: document.body,
  engine,
  options: {
    wireframes: false,
    width,
    height
  }
})
Render.run(render)
Runner.run(Runner.create(), engine)

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, borderWeight, { isStatic: true }), // top border
  Bodies.rectangle(width / 2, height, width, borderWeight, { isStatic: true }), // bottom border
  Bodies.rectangle(0, height / 2, borderWeight, height, { isStatic: true }), // left border
  Bodies.rectangle(width, height / 2, borderWeight, height, { isStatic: true }) // right border
]
World.add(world, walls)

// Maze generation || Generate 2 dimensional array with defaul value set to false
const grid = generateGrid(cellsVertical, cellsHorizontal)
const verticals = generateGrid(cellsVertical, cellsHorizontal - 1)
const horizontals = generateGrid(cellsVertical - 1, cellsHorizontal)

const startRow = Math.floor(Math.random() * cellsVertical)
const startColumn = Math.floor(Math.random() * cellsHorizontal)

const stepThroughCell = (row, column) => {
  // If i have visited the cell at [row, column], then return
  if (grid[row][column]) {
    return
  }

  // Mark this cell as being visited
  grid[row][column] = true

  // Assemble randomly-ordered list of neighbors
  const neighbors = suffle([
    [row - 1, column, 'up'], // top
    [row + 1, column, 'down'], // bottom
    [row, column - 1, 'left'], // left
    [row, column + 1, 'right'] // right
  ])

  // For each neighbor
  for (const neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor

    // See if that neighbor is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue
    }

    // If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue
    }

    // Remove a wall from either horizontals or verticals
    if (direction === 'left') {
      verticals[row][column - 1] = true
    } else if (direction === 'right') {
      verticals[row][column] = true
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true
    } else if (direction === 'down') {
      horizontals[row][column] = true
    }

    // Visit that next cell
    stepThroughCell(nextRow, nextColumn)
  }
}

stepThroughCell(startRow, startColumn)

const wallOptionConfig = {
  isStatic: true,
  label: 'wall',
  render: {
    fillStyle: wallColor
  }
}

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      edgeWeight,
      wallOptionConfig
    )
    World.add(world, wall)
  })
})

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      edgeWeight,
      unitLengthY,
      wallOptionConfig
    )
    World.add(world, wall)
  })
})

// Goal
const goalLength = Math.min(unitLengthX, unitLengthY) * 0.7
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  goalLength,
  goalLength,
  {
    isStatic: true,
    label: 'goal',
    render: {
      fillStyle: goalColor
    }
  }
)
World.add(world, goal)

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) * 0.3
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  label: 'ball',
  render: {
    fillStyle: ballColor
  }
})
World.add(world, ball)

// User control
document.addEventListener('keydown', (event) => {
  const { x, y } = ball.velocity
  if (event.keyCode === 87) {
    Body.setVelocity(ball, { x, y: y - 5 })
  }

  if (event.keyCode === 68) {
    Body.setVelocity(ball, { x: x + 5, y })
  }

  if (event.keyCode === 83) {
    Body.setVelocity(ball, { x, y: y + 5 })
  }

  if (event.keyCode === 65) {
    Body.setVelocity(ball, { x: x - 5, y })
  }
})

// Win condition
Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((collision) => {
    const labels = ['ball', 'goal']

    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector('.winner').classList.remove('hidden')
      world.gravity.y = 1
      world.bodies.forEach((body) => {
        if (body.label === 'wall') {
          Body.setStatic(body, false)
        }
      })
    }
  })
})
