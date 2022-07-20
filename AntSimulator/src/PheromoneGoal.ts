import Pheromone from './Pheromone';
import PheromoneData from './PheromoneData';

export default abstract class PheromoneGoal {
  abstract decidePheromone(pheromone: PheromoneData): number | undefined;
}
