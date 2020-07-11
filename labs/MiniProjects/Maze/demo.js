const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter

const width = 800
const height = 600

const engine = Engine.create()
const { world } = engine
const render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height
  }
})
Render.run(render)
Runner.run(Runner.create(), engine)

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
  })
)

// Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }), // top border
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }), // bottom border
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }), // left border
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }) // right border
]
World.add(world, walls)

const shape = Bodies.rectangle(200, 200, 50, 50)
World.add(world, shape)

// Random shapes
for (let i = 0; i < 50; i++) {
  if (Math.random() > 0.5) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50)
    )
  } else {
    World.add(
      world,
      Bodies.circle(Math.random() * width, Math.random() * height, 35)
    )
  }
}
