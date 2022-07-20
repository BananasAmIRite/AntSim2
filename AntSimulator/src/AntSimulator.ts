import PheromoneData from './PheromoneData';
import { hexToRGB } from './utils';
import Vector2 from './Vector2';
import PheromoneMap from './PheromoneMap';
import Ant from './Ant';
import { PheromoneType, PheromoneTypes } from './Pheromone';
import PixelObject, { getPixelType } from './PixelObject';

export default class AntSimulator {
  private pixels: PixelObject[];
  private pheromoneMap!: PheromoneMap;
  private canvas: HTMLCanvasElement;
  private unitSize: number;
  private ants: Ant[];

  constructor(canvas: HTMLCanvasElement, imageMap: HTMLImageElement, unitSize: number) {
    this.pixels = [];
    this.ants = [];
    this.canvas = canvas;
    this.unitSize = unitSize;
    canvas.width = imageMap.naturalWidth * unitSize;
    canvas.height = imageMap.naturalHeight * unitSize;
    this.loadMap(imageMap);
  }

  private loadMap(map: HTMLImageElement) {
    const tempCnv = document.createElement('canvas');

    tempCnv.width = map.naturalWidth;
    tempCnv.height = map.naturalHeight;
    const tempCtx = tempCnv.getContext('2d');

    if (!tempCtx) throw new Error('???');

    tempCtx.drawImage(map, 0, 0, map.naturalWidth, map.naturalHeight); // downscaled, accurate version

    const pheromoneMap: PheromoneData[][] = [];
    for (let y = 0; y < tempCnv.height; y++) {
      const pheromoneArray = [];
      for (let x = 0; x < tempCnv.width; x++) {
        const imgData = tempCtx.getImageData(x, y, 1, 1).data;
        pheromoneArray.push(new PheromoneData({ x, y }));
        const pixelType = getPixelType(`rgba(${imgData[0]}, ${imgData[1]}, ${imgData[2]}, ${imgData[3]})`);
        if (!pixelType) continue;
        this.pixels.push(new PixelObject({ x, y }, pixelType));
      }
      pheromoneMap.push(pheromoneArray);
    }
    this.pheromoneMap = new PheromoneMap(pheromoneMap);

    // this.render();
  }

  private render() {
    // console.log(this.ants);

    // console.log('rendering');

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('no context to draw to');
    this.updateMap();
    this.renderMap(ctx);
    this.renderPheromones(ctx);
    this.renderAnts(ctx);
    requestAnimationFrame(() => this.render());
    // setTimeout(() => this.render(), 1000);
  }

  private renderMap(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    for (const pixel of this.pixels) {
      ctx.fillStyle = pixel.getType();
      const pos = pixel.getPos();
      ctx.fillRect(pos.x * this.unitSize, pos.y * this.unitSize, this.unitSize, this.unitSize);
    }
    // throw new Error();
  }

  private renderAnts(ctx: CanvasRenderingContext2D) {
    this.ants.forEach((ant) => {
      ctx.fillStyle = 'red';
      const pos = ant.getPosition();
      ctx.fillRect(Math.round(pos.x) * this.unitSize, Math.round(pos.y) * this.unitSize, this.unitSize, this.unitSize);

      // ctx.strokeStyle = 'yellow';
      // const angle = ant.getAngle();
      // ctx.beginPath();
      // ctx.moveTo(
      //   Math.round(pos.x) * this.unitSize + this.unitSize / 2,
      //   Math.round(pos.y) * this.unitSize + this.unitSize / 2
      // );
      // ctx.lineTo(
      //   (Math.round(pos.x) + Math.cos(angle) * 5) * this.unitSize + this.unitSize / 2,
      //   (Math.round(pos.y) + Math.sin(angle) * 5) * this.unitSize + this.unitSize / 2
      // );
      // ctx.stroke();
    });
  }

  private updateMap() {
    // return Promise.allSettled([
    //   new Promise((res, rej) => {
    //     this.updatePheromones();
    //     res(null);
    //   }),
    //   ...this.ants.map(
    //     (ant) =>
    //       new Promise((res, rej) => {
    //         ant.runFrame();
    //         res(null);
    //       })
    //   ),
    // ]);
    for (const ant of this.ants) {
      ant.runFrame();
    }
    this.updatePheromones();
  }

  private updatePheromones() {
    // console.log('updating pheromones');

    const changes = [];
    for (let y = 0; y < this.pheromoneMap.getMap().length; y++) {
      for (let x = 0; x < this.pheromoneMap.getRow(y).length; x++) {
        for (const pheromoneType of PheromoneTypes) {
          // calculate average
          // const leftPixel = this.pheromoneMap.getPheromoneLevel({ x: x - 1, y }, pheromoneType);
          // const topLeftPixel = this.pheromoneMap.getPheromoneLevel({ x: x - 1, y: y - 1 }, pheromoneType);
          // const rightPixel = this.pheromoneMap.getPheromoneLevel({ x: x + 1, y }, pheromoneType);
          // const topRightPixel = this.pheromoneMap.getPheromoneLevel({ x: x + 1, y: y - 1 }, pheromoneType);
          // const topPixel = this.pheromoneMap.getPheromoneLevel({ x, y: y - 1 }, pheromoneType);
          // const bottomLeftPixel = this.pheromoneMap.getPheromoneLevel({ x: x - 1, y: y + 1 }, pheromoneType);
          // const bottomPixel = this.pheromoneMap.getPheromoneLevel({ x, y: y + 1 }, pheromoneType);
          // const bottomRightPixel = this.pheromoneMap.getPheromoneLevel({ x: x + 1, y: y + 1 }, pheromoneType);
          const middle = this.pheromoneMap.getPheromoneLevel({ x, y }, pheromoneType);

          // const average =
          //   (leftPixel +
          //     topLeftPixel +
          //     rightPixel +
          //     topRightPixel +
          //     topPixel +
          //     bottomLeftPixel +
          //     bottomPixel +
          //     bottomRightPixel +
          //     middle) /
          //   9;

          //   console.log(average);

          if (Math.max(middle - 5, 0) !== middle)
            // changes.push(() =>
            this.pheromoneMap.get({ x, y }).updatePheromoneLevels(pheromoneType, Math.max(middle - 5, 0));
          // );
          // changes.push(1);
        }

        // for (const change of changes) {
        //   change();
        // }

        // const average = middle;

        // this.set({ x, y }, Math.floor(Math.max(average - 5, 0)));
      }
    }
    // console.log('finished updating pheromones');
  }

  private renderPheromones(ctx: CanvasRenderingContext2D) {
    // console.log('rendeirng pheromones');

    // let count = 0;
    this.pheromoneMap.for((pheromone, x, y) => {
      for (const pheromoneType of pheromone.getPheromones()) {
        // count++;
        ctx.fillStyle = pheromoneType.getType();
        const rgb = hexToRGB(ctx.fillStyle as string);
        ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${pheromoneType.getLevel() / 255})`;
        // console.log(pheromoneType.getLevel() / 255);

        // console.log(ctx.fillStyle);

        ctx.fillRect(x * this.unitSize, y * this.unitSize, this.unitSize, this.unitSize);
      }
    });
    // console.log('finished rendering pheromones');

    // console.log(count);

    // const m = this.pheromoneMap.getMap();
    // for (let y = 0; y < m.length; y++) {
    //   for (let x = 0; x < m[y].length; x++) {
    //     const pheromone = m[y][x];
    //     for (const pheromoneType of pheromone.getPheromones()) {
    //       ctx.fillStyle = pheromoneType.getType();
    //       const rgb = hexToRGB(ctx.fillStyle);
    //       ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${pheromoneType.getLevel() / 255})`;
    //       // console.log(pheromoneType.getLevel() / 255);

    //       // console.log(ctx.fillStyle);

    //       ctx.fillRect(x * this.unitSize, y * this.unitSize, this.unitSize, this.unitSize);
    //     }
    //   }
    // }
  }

  public spawnAnt(angle: number = 0) {
    const pos = { x: 0, y: 0 }; // TODO: make something that determines the map pixel at which to spawn the ants based on the red spawn pixels

    this.ants.push(new Ant(this, pos, angle));
  }

  public getPheromoneLevel(v: Vector2) {
    return this.pheromoneMap.get(v);
  }

  public start() {
    for (let i = 0; i < 100; i++) {
      this.spawnAnt(-Math.random() * Math.PI);
    }
    // for (let x = 5; x < 10; x++) {
    //   for (let y = 5; y < 10; y++) {
    //     this.pheromoneMap.set({ x, y }, PheromoneType.FOOD, 255);
    //   }
    // }

    this.render();
  }

  public addPheromone(v: Vector2, type: PheromoneType): void {
    // console.log('adding');

    this.pheromoneMap.set(v, type, 255);
  }

  public getWidth() {
    return this.canvas.width / this.unitSize;
  }

  public getHeight() {
    return this.canvas.height / this.unitSize;
  }
}
