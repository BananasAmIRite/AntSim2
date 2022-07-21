import EfficientPheromoneData from './EfficientPheromoneData';
import { PheromoneType } from './Pheromone';
import PheromoneData from './PheromoneData';
import Vector2 from './Vector2';

export default class EfficientPheromoneMap {
  private pheromoneMap: (PheromoneData | null)[][];
  constructor(pheromoneMap: (PheromoneData | null)[][]) {
    this.pheromoneMap = pheromoneMap;
  }

  public getMap() {
    return this.pheromoneMap;
  }

  public get(v: Vector2) {
    return this.pheromoneMap[Math.round(v.y)]?.[Math.round(v.x)];
  }

  public getPheromoneLevel(v: Vector2, type: PheromoneType) {
    return this.get(v)?.getPheromone(type)?.getLevel() || 0;
  }

  public getRow(y: number) {
    return this.pheromoneMap[y];
  }

  public set(v: Vector2, type: PheromoneType, level: number) {
    // console.log(this.get(v));
    let p = this.get(v);
    if (!p) {
      p = new EfficientPheromoneData(this, { x: Math.round(v.x), y: Math.round(v.y) });
      this.pheromoneMap[Math.round(v.y)][Math.round(v.x)] = p;
    }

    p.updatePheromoneLevels(type, level);

    // this.get(v)?.updatePheromoneLevels(type, level);
  }

  public for(it: (phermone: PheromoneData, x: number, y: number) => any) {
    for (let y = 0; y < this.pheromoneMap.length; y++) {
      for (let x = 0; x < this.pheromoneMap[y].length; x++) {
        if (this.pheromoneMap[y][x] !== null) it(this.pheromoneMap[y][x] as PheromoneData, x, y);
      }
    }
  }

  public removePheromoneData(pheromoneData: EfficientPheromoneData) {
    this.pheromoneMap[pheromoneData.getLocation().y][pheromoneData.getLocation().x] = null;
  }
}
