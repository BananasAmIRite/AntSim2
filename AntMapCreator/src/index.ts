const PIXEL_WIDTH = 10;
const PIXEL_HEIGHT = 10;

const canvas = document.getElementById('canvas');
if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Invalid canvas');

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

const PIXEL_AMOUNT_WIDTH = Math.ceil(canvas.width / PIXEL_WIDTH);
const PIXEL_AMOUNT_HEIGHT = Math.ceil(canvas.height / PIXEL_HEIGHT);

const ctx = canvas.getContext('2d');

if (!ctx) throw new Error('No rendering context');

const pixels: Map<number, Map<number, string>> = new Map();

const currentMousePosition = { x: 0, y: 0 };

const offset = { x: 0, y: 0 };

let isCtrlDown = false;
let isMouseDown = false;

let currentPaletteColor = 'white';

window.onload = () => {
  canvas.addEventListener('mousemove', (e) => {
    currentMousePosition.x = e.offsetX;
    currentMousePosition.y = e.offsetY;

    if (isCtrlDown && isMouseDown) {
      offset.x -= e.movementX;
      offset.y -= e.movementY;
    }

    if (isMouseDown && !isCtrlDown) setPixelAtCurrentMousePos(currentPaletteColor);
  });
  canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
  });
  canvas.addEventListener('mousedown', () => {
    isMouseDown = true;
  });

  window.addEventListener('keydown', (e) => {
    isCtrlDown = e.ctrlKey;
    if (e.key === 's' && e.ctrlKey) {
      e.preventDefault();
      const url = toBaseURL();
      const a = document.createElement('a');
      a.download = 'image.png';
      a.href = url;
      a.target = '_blank';
      a.click();
    }
  });
  window.addEventListener('keyup', (e) => {
    isCtrlDown = e.ctrlKey;
  });
};

// for (let i = 0; i < PIXEL_AMOUNT_HEIGHT; i++) {
//   const a = [];
//   for (let j = 0; j < PIXEL_AMOUNT_WIDTH; j++) {
//     a.push({ color: 'black' });
//   }
//   pixels.push(a);
// }

function setPixelAtCurrentMousePos(color: string) {
  setPixelAtMousePosition(currentMousePosition.x, currentMousePosition.y, color);
}

function setPixelAtMousePosition(x: number, y: number, color: string) {
  setPixelAtPixelPosition(Math.floor((x + offset.x) / PIXEL_WIDTH), Math.floor((y + offset.y) / PIXEL_HEIGHT), color);
}

function setPixelAtPixelPosition(x: number, y: number, color: string) {
  console.log(`set at ${x}, ${y}, color: ${color}`);

  if (pixels.has(x)) {
    pixels.get(x)?.set(y, color);
  } else {
    const m = new Map();
    m.set(y, color);
    pixels.set(x, m);
  }
}

(() => {
  const render = () => {
    // console.log('hey');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const [x, col] of pixels) {
      for (const [y, color] of col) {
        if (!isInViewport(x, y)) continue;
        // console.log('viewport bounds: ');

        // console.log(x * PIXEL_WIDTH - offset.x, y * PIXEL_HEIGHT - offset.y);

        ctx.fillStyle = color;

        ctx.fillRect(x * PIXEL_WIDTH - offset.x, y * PIXEL_HEIGHT - offset.y, PIXEL_WIDTH, PIXEL_HEIGHT);
      }
    }
    requestAnimationFrame(render);
  };

  (() => {
    requestAnimationFrame(render);
  })();
})();

function isInViewport(x: number, y: number): boolean {
  const xPixel = x * PIXEL_WIDTH;
  const yPixel = y * PIXEL_HEIGHT;

  const LOWER_BOUND_W = offset.x - PIXEL_WIDTH;
  const LOWER_BOUND_H = offset.y - PIXEL_HEIGHT;
  const UPPER_BOUND_W = offset.x + CANVAS_WIDTH;
  const UPPER_BOUND_H = offset.y + CANVAS_HEIGHT;

  // console.log(xPixel);
  // console.log(yPixel);

  // console.log(LOWER_BOUND_W, UPPER_BOUND_W, LOWER_BOUND_H, UPPER_BOUND_H);

  return xPixel >= LOWER_BOUND_W && xPixel < UPPER_BOUND_W && yPixel >= LOWER_BOUND_H && yPixel < UPPER_BOUND_H;
}

function onPaletteChange(e: MouseEvent) {
  const prevElem = document.querySelector(`[data-color=${currentPaletteColor}]`);
  if (prevElem) prevElem.removeAttribute('data-selected');

  const newElem = e.target as Element;
  const color = newElem.getAttribute('data-color');
  if (!color) throw new Error('Invalid color (this should never happen)');
  newElem.setAttribute('data-selected', 'true');

  currentPaletteColor = color;
}

(() => {
  ['red', 'black', 'green'].forEach((e, i) => {
    const elem = document.createElement('button');
    elem.classList.add('clr');
    elem.style.backgroundColor = e;
    elem.setAttribute('data-color', e);
    elem.addEventListener('click', onPaletteChange);
    if (i === 0) {
      elem.setAttribute('data-selected', 'true');
      currentPaletteColor = e;
    }

    document.getElementById('palette')?.appendChild(elem);
  });
})();

function toBaseURL() {
  const canvas = document.createElement('canvas');
  // initialize width and height
  let highestX = 0;
  let highestY = 0;
  let offsetX = Infinity;
  let offsetY = Infinity;
  for (const [x, col] of pixels) {
    highestX = Math.max(x, highestX);
    offsetX = Math.min(x, offsetX);
    for (const [y, val] of col) {
      highestY = Math.max(y, highestY);
      offsetY = Math.min(y, offsetY);
    }
  }

  // setPixelAtPixelPosition(offsetX, offsetY, 'yellow');
  // setPixelAtPixelPosition(highestX, highestY, 'yellow');

  canvas.width = highestX - offsetX + 1;
  canvas.height = highestY - offsetY + 1;

  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('???');
  // const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height); 

  for (const [x, col] of pixels) {
    for (const [y, val] of col) {
      // const imgData = ctx?.createImageData(1, 1);
      ctx.fillStyle = val;

      // imgData?.data.set([...hexToRGB(ctx.fillStyle), 1]);
      // ctx.putImageData(imgData, x, y);

      const offsettedX = x - offsetX;
      const offsettedY = y - offsetY;
      ctx.fillRect(offsettedX, offsettedY, 1, 1);

      // console.log(`set at (${offsettedX}, ${offsettedY}) color ${ctx.fillStyle} or ${val}`);
    }
  }

  // ctx has been painted
  return canvas.toDataURL();
}

function hexToRGB(hex: string) {
  const extracted = /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/g.exec(hex);

  if (!extracted) throw new Error('Invalid hex');

  const r = parseInt(extracted[1], 16);
  const g = parseInt(extracted[2], 16);
  const b = parseInt(extracted[3], 16);

  return [r, g, b];
}
