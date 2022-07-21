import Ant from './Ant';
import AntSimulator from './AntSimulator';
import FoodGoal from './FoodGoal';
import Goal from './Goal';
import { PheromoneType } from './Pheromone';
import { PixelType } from './PixelObject';
import SingularPheromoneGoal from './SingularPheromoneGoal';

export default class HomeGoal extends Goal {
  init(ant: Ant, sim: AntSimulator): void {
    ant.setPheromoneObjective(new SingularPheromoneGoal(PheromoneType.TRACKER));
    ant.setPheromoneToEmit(PheromoneType.FOOD);
  }
  check(ant: Ant, sim: AntSimulator): boolean {
    const pos = ant.getPosition();

    return sim.getPixelObjectAt({ x: Math.round(pos.x), y: Math.round(pos.y) })?.getType() === PixelType.SPAWN || false;
  }
  onFinish(ant: Ant, sim: AntSimulator): void {
    ant.setGoal(new FoodGoal());
    ant.setAngle(ant.getAngle() + Math.PI);
    // sim.spawnAnt(-Math.random() * Math.PI);
  }
}
