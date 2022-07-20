import Vector2 from './Vector2';
import AntSimulator from './AntSimulator';
import PheromoneGoal from './PheromoneGoal';
import { PheromoneType } from './Pheromone';
import SingularPheromoneGoal from './SingularPheromoneGoal';

export default class Ant {
  private position: Vector2;
  private angle: number;
  private map: AntSimulator;
  private goal: PheromoneGoal;
  private pheromoneToEmit: PheromoneType | undefined;
  constructor(map: AntSimulator, pos: Vector2, initialAngle: number) {
    this.position = pos;
    this.angle = initialAngle;
    this.map = map;
    const b = Math.random() > 0.5;
    this.goal = new SingularPheromoneGoal(b ? PheromoneType.FOOD : PheromoneType.TRACKER);
    this.pheromoneToEmit = b ? PheromoneType.TRACKER : PheromoneType.FOOD;
    // this.pheromoneToEmit = undefined;
  }

  runFrame() {
    // console.log(this.emitPheromones);
    // console.log(this.position);

    this.updateAngle();
    this.updatePosition();
    if (this.pheromoneToEmit) this.map.addPheromone(this.position, this.pheromoneToEmit);
    // console.log(this.angle);
  }

  private updateAngle() {
    const forward = this.sense(0);
    const left = this.sense(Math.PI / 2);
    const right = this.sense(-Math.PI / 2);
    // console.log(`forward: ${forward}, left: ${left}, right: ${right}`);

    if (right > forward && right > left) {
      this.angle -= Math.PI / 6;
    } else if (left > forward && left > right) {
      this.angle += Math.PI / 6;
    }
    this.angle *= Math.random() * 0.02 + 0.99;
  }

  private updatePosition() {
    // if (this.pheromoneTrail.length > this.map.pheromoneTrailDisappearIterations) this.pheromoneTrail.shift(); // kinda volatile but ehhh

    const newPos = {
      x: this.position.x + Math.cos(this.angle) * 1,
      y: this.position.y + Math.sin(this.angle) * 1,
    };

    if (newPos.x >= this.map.getWidth() - 1 || newPos.x <= 0 || newPos.y >= this.map.getHeight() - 1 || newPos.y <= 0) {
      this.angle = Math.random() * Math.PI * 2;
    } else {
      this.position = newPos;
    }
  }

  private sense(senseOffset: number): number {
    const sensingAngle = this.angle + senseOffset;
    const sensingPoint = {
      x: this.position.x + Math.cos(sensingAngle),
      y: this.position.y + Math.sin(sensingAngle),
    };

    try {
      // return this.map.getPheromoneLevel(sensingPoint) * Math.random(); // * random weight
      return this.map.getPheromoneLevel(sensingPoint).test(this.goal) || 0;
    } catch (err) {
      return 0;
    }
  }

  getAngle() {
    return this.angle;
  }

  getPosition() {
    return this.position;
  }
}
