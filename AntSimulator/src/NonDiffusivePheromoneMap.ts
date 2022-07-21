import NonDiffusivePheromoneData from './NonDiffusivePheromoneData';
import { PheromoneType } from './Pheromone';
import Vector2 from './Vector2';

export default class NonDiffusivePheromoneMap {
  private pheromoneMap: NonDiffusivePheromoneData[];
  constructor() {
    this.pheromoneMap = [];
  }

  public getMap() {
    return this.pheromoneMap;
  }

  public get(v: Vector2) {
    return this.pheromoneMap.find((e) => {
      // console.log(e.getLocation().x, Math.round(v.x));
      // console.log();

      return e.getLocation().x === Math.round(v.x) && e.getLocation().y === Math.round(v.y);
    });
  }

  public getPheromoneLevel(v: Vector2, type: PheromoneType) {
    return this.get(v)?.getPheromone(type)?.getLevel() || 0;
  }

  public set(v: Vector2, type: PheromoneType, level: number) {
    let p = this.get(v);
    if (!p) {
      p = new NonDiffusivePheromoneData(this, { x: Math.round(v.x), y: Math.round(v.y) });
      this.pheromoneMap.push(p);
    }

    p.updatePheromoneLevels(type, level);
  }

  public removePheromoneData(pheromoneData: NonDiffusivePheromoneData) {
    // console.log(`Removing pheromonedata with id, ${pheromoneData.id}`);

    this.pheromoneMap.splice(this.pheromoneMap.indexOf(pheromoneData), 1);
  }

  public for(it: (phermone: NonDiffusivePheromoneData, x: number, y: number) => any) {
    for (const pheromone of this.pheromoneMap) {
      it(pheromone, pheromone.getLocation().x, pheromone.getLocation().y);
    }
  }
}
