import Pheromone, { PheromoneType } from './Pheromone';
import PheromoneData from './PheromoneData';
import PheromoneGoal from './PheromoneGoal';

export default class SingularPheromoneGoal extends PheromoneGoal {
  private pheromoneToSense: PheromoneType;
  constructor(pheromoneToSense: PheromoneType) {
    super();
    this.pheromoneToSense = pheromoneToSense;
  }

  decidePheromone(pheromones: PheromoneData): number | undefined {
    for (const pheromone of pheromones.getPheromones()) {
      if (pheromone.getType() === this.pheromoneToSense) return pheromone.getLevel();
    }
    return;
  }
}
