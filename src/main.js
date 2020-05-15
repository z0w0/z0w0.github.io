import './main.scss';
import matter from 'matter-js';

const { Engine, World, Bodies, Composite, Body, Vector, Events } = matter;

const BOUNDS_WIDTH = 30;
const NUM_COLUMNS = 13;
const FONT_SIZE = 16;

const button = document.getElementById('button');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const engine = Engine.create({ enableSleeping: true });

engine.world.gravity = { x: 0, y: 1, scale: 0.001 };
context.font = `${FONT_SIZE}px IBM Plex Mono`;
context.textAlign = 'center';

const createRectangularText = (text, x, y, options = {}) => {
  const measure = context.measureText(text);
  const body = Bodies.rectangle(x, y, measure.width, FONT_SIZE * 0.85, options);
  body.text = text;

  return body;
};

const createBounds = () => [
  Bodies.rectangle(-BOUNDS_WIDTH / 2, canvas.height / 2, BOUNDS_WIDTH, canvas.height, { isStatic: true }),
  Bodies.rectangle(canvas.width + BOUNDS_WIDTH / 2, canvas.height / 2, BOUNDS_WIDTH, canvas.height, { isStatic: true }),
  Bodies.rectangle(canvas.width / 2, -BOUNDS_WIDTH, canvas.width, BOUNDS_WIDTH, { isStatic: true }),
  Bodies.rectangle(canvas.width / 2, canvas.height + BOUNDS_WIDTH / 2, canvas.width, BOUNDS_WIDTH, { isStatic: true })
];

// The actual button sits as an anchor tag over the top of the canvas.
// We just have an invisible body representing it.
const createButtonBody = () =>
  Bodies.rectangle(canvas.width / 2, canvas.height - 40, 170, 60, { isStatic: true });

// Adds the tag line as individual bodys.
// Just rectangular - doesn't bother making the text polygons (but it definitely could be).
const createCharacters = () => [
  'I like making',
  'software that',
  'users love...'
].reduce(
  (result, text, row) => [
    ...result,
    ...new Array(text.length)
      .fill()
      .map((_, column) => (
        text[column].trim()
          ? createRectangularText(
            text[column],
            canvas.width / 2 + (column - NUM_COLUMNS / 2) * FONT_SIZE * 0.725,
            canvas.height / 4 + row * FONT_SIZE * 1.2,
            { label: 'character', isStatic: true }
          )
          : undefined
      ))
      .filter(Boolean)
  ],
  []
);

// Renders the world using plain ol' text.
const render = () => {
  const bodies = Composite.allBodies(engine.world);

  window.requestAnimationFrame(render);

  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (const body of bodies) {
    if (!body.text) continue;

    const height = body.bounds.max.y - body.bounds.min.y;

    context.fillStyle = '#fff';
    context.fillText(body.text, body.position.x, body.position.y + height / 2);
  }
};

const activateWorld = () => {
  const bodies = Composite.allBodies(engine.world);

  for (const body of bodies) {
    if (body.label !== 'character') continue;

    Body.applyForce(body, body.position, Vector.create((Math.random() - 0.5) * 0.004, Math.random() * 0.001));
    Body.setStatic(body, false);
  }
};

button.addEventListener('click', activateWorld, false);
button.addEventListener('mouseenter', activateWorld, false);

// Add all the physics bodies and run 'er
World.add(engine.world, [
  createButtonBody(),
  ...createBounds(),
  ...createCharacters()
]);

Engine.run(engine);
render();