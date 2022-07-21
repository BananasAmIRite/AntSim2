import Pheromone, { PheromoneType } from './Pheromone';
import PheromoneGoal from './PheromoneGoal';
import Vector2 from './Vector2';

export default class PheromoneData {
  protected pheromones: Pheromone[];
  private location: Vector2;

  private static id = 0;

  public id: number;

  constructor(loc: Vector2) {
    this.pheromones = [];
    this.location = loc;
    this.id = PheromoneData.id;
    PheromoneData.id++;
  }

  test(goal: PheromoneGoal): number | undefined {
    return goal.decidePheromone(this);
  }

  getPheromones() {
    return this.pheromones;
  }

  getPheromone(type: PheromoneType) {
    return this.pheromones.find((e) => e.getType() === type);
  }

  updatePheromoneLevels(type: PheromoneType, level: number) {
    const pheromone = this.pheromones.find((e) => e.getType() === type);
    if (pheromone) {
      pheromone.setLevel(level);
    } else if (level > 0) this.pheromones.push(new Pheromone(this, type, level));
  }

  getLocation() {
    return this.location;
  }

  public removePheromone(pheromone: Pheromone) {
    this.getPheromones().splice(this.getPheromones().indexOf(pheromone), 1);
  }
}
