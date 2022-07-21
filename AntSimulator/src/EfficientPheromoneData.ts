import EfficientPheromoneMap from './EfficientPheromoneMap';
import NonDiffusivePheromoneMap from './NonDiffusivePheromoneMap';
import Pheromone, { PheromoneType } from './Pheromone';
import PheromoneData from './PheromoneData';
import PheromoneGoal from './PheromoneGoal';
import Vector2 from './Vector2';

export default class EfficientPheromoneData extends PheromoneData {
  private map: EfficientPheromoneMap;
  constructor(map: EfficientPheromoneMap, loc: Vector2) {
    super(loc);
    this.map = map;
  }

  test(goal: PheromoneGoal): number | undefined {
    return goal.decidePheromone(this);
  }

  public updatePheromoneLevels(type: PheromoneType, level: number) {
    const pheromone = this.pheromones.find((e) => e.getType() === type);
    if (pheromone) {
      pheromone.setLevel(level);
    } else if (level > 0) this.pheromones.push(new Pheromone(this, type, level));
  }

  public removePheromone(pheromone: Pheromone) {
    super.removePheromone(pheromone);
    if (this.getPheromones().length === 0) {
      this.map.removePheromoneData(this);
    }
  }
}
