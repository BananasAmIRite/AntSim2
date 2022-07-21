import Ant from './Ant';
import AntSimulator from './AntSimulator';
import Goal from './Goal';
import HomeGoal from './HomeGoal';
import { PheromoneType, PheromoneTypes } from './Pheromone';
import { PixelType } from './PixelObject';
import SingularPheromoneGoal from './SingularPheromoneGoal';

export default class FoodGoal extends Goal {
  init(ant: Ant, sim: AntSimulator): void {
    ant.setPheromoneObjective(new SingularPheromoneGoal(PheromoneType.FOOD));
    ant.setPheromoneToEmit(PheromoneType.TRACKER);
  }
  check(ant: Ant, sim: AntSimulator): boolean {
    const pos = ant.getPosition();
    return sim.getPixelObjectAt({ x: Math.round(pos.x), y: Math.round(pos.y) })?.getType() === PixelType.FOOD || false;
  }
  onFinish(ant: Ant, sim: AntSimulator): void {
    const pos = ant.getPosition();
    sim.removePixelObjectAt({ x: Math.round(pos.x), y: Math.round(pos.y) });
    ant.setGoal(new HomeGoal());
  }
}
