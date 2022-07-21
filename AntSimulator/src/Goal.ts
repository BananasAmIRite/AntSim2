import Ant from './Ant';
import AntSimulator from './AntSimulator';

export default abstract class Goal {
  private started = false;
  abstract init(ant: Ant, sim: AntSimulator): void;
  abstract check(ant: Ant, sim: AntSimulator): boolean;
  abstract onFinish(ant: Ant, sim: AntSimulator): void;

  public hasInitialized() {
    return this.started;
  }

  public initialize(ant: Ant, sim: AntSimulator) {
    this.started = true;
    this.init(ant, sim);
  }
}
