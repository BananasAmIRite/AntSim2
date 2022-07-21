import PheromoneData from './PheromoneData';

export default class Pheromone {
  private type: PheromoneType;
  private level: number;
  private data: PheromoneData;

  constructor(data: PheromoneData, type: PheromoneType, level: number = 1) {
    this.data = data;
    this.type = type;
    this.level = level;
  }

  public getType() {
    return this.type;
  }

  public getLevel() {
    return this.level;
  }

  public setLevel(level: number) {
    this.level = level;
    if (this.level <= 10) {
      // const i = this.data.getPheromones().indexOf(this);
      // console.log(i);
      // if (i === -1) console.log(`Error? Pos: [${this.data.getLocation().x}, ${this.data.getLocation().y}]`);

      // console.log(
      //   `Len before [${this.data.getLocation().x}, ${this.data.getLocation().y}]: ` + this.data.getPheromones()
      // );

      this.data.removePheromone(this);
      // console.log(
      //   `Len after: [${this.data.getLocation().x}, ${this.data.getLocation().y}]` + this.data.getPheromones()
      // );
    }
  }
}

export enum PheromoneType {
  FOOD = 'green',
  TRACKER = 'white',
}

export const PheromoneTypes = Object.values(PheromoneType);
