import AntSimulator from './AntSimulator';

window.onload = () => {
  document.getElementById('map-picker-form')?.addEventListener('submit', onMapPick);
};

function onMapPick(e: SubmitEvent) {
  console.log('a');

  e.preventDefault();
  const target = e.target as HTMLFormElement;
  const filePicker = target.elements.namedItem('file-picker') as HTMLInputElement;
  const f = filePicker.files?.[0];
  if (!f) return;
  display('canvas');
  const cnv = document.getElementById('canvas') as HTMLCanvasElement;
  if (!cnv) throw new Error('no canvas present');
  createMap(cnv, f, 2);
}

function display(elem: string) {
  for (const c of document.body.children) {
    if (!(c instanceof HTMLElement)) continue;
    c.style.display = 'none';
  }
  const toDisplay = document.getElementById(elem);
  if (!toDisplay) throw new Error('nothing to display');
  toDisplay.style.display = 'block';
}

async function createMap(elem: HTMLCanvasElement, file: File, unitSize: number) {
  const url = URL.createObjectURL(file);

  const ctx = elem.getContext('2d');
  if (!ctx) throw new Error('no context');

  const img = document.createElement('img') as HTMLImageElement;
  img.src = url;
  elem.style.imageRendering = 'pixelated';
  // ctx.filter = 'url(#remove-alpha)';
  ctx.imageSmoothingEnabled = false;
  img.onload = () => {
    // @ts-ignore
    window.antSim = new AntSimulator(elem, img, unitSize);
    // @ts-ignore
    window.antSim.start();

    URL.revokeObjectURL(url);
  };
}

async function cropMap(file: File) {
  const p = await new Promise((res, rej) => {
    display('map-cropper');
    const url = URL.createObjectURL(file);

    const imgSelector = document.getElementById('img-selector');
    const selectedImg = document.getElementById('selected-img') as HTMLImageElement;
    if (!imgSelector) throw new Error('No image selector');
    if (!selectedImg) throw new Error('No selected img');
    selectedImg.setAttribute('src', url);
    selectedImg.addEventListener('load', () => {
      imgSelector.style.position = 'absolute';
      imgSelector.style.width = `${selectedImg.naturalWidth / 2}px`;
      imgSelector.style.height = `${selectedImg.naturalHeight / 2}px`;
      imgSelector.style.zIndex = '1000';
      imgSelector.addEventListener('drag', (e) => {
        e.preventDefault();
        console.log(e);

        const oldLeft = parseInt(/(\d*)px/g.exec(imgSelector.style.marginLeft || '0px')?.[1] || '0');
        const oldTop = parseInt(/(\d*)px/g.exec(imgSelector.style.marginTop || '0px')?.[1] || '0');
        console.log(oldLeft);
        console.log(oldTop);

        imgSelector.style.marginLeft = `${e.movementX + oldLeft}px`;
        imgSelector.style.marginTop = `${e.movementY + oldTop}px`;
        // imgSelector.style.marginLeft =
        // res.
      });
      // imgSelector.addEventListener('dragstart', (e) => {
      //   e.preventDefault();
      // });
      // imgSelector.addEventListener('dragend', (e) => {
      //   e.preventDefault();
      // });
    });
  });

  // so no mem leak
  // URL.revokeObjectURL(url);
}
