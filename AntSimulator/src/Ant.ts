import Vector2 from './Vector2';
import AntSimulator from './AntSimulator';
import PheromoneGoal from './PheromoneGoal';
import { PheromoneType } from './Pheromone';
import SingularPheromoneGoal from './SingularPheromoneGoal';
import Goal from './Goal';
import FoodGoal from './FoodGoal';

export default class Ant {
  private position: Vector2;
  private angle: number;
  private map: AntSimulator;
  private pheromoneObjective: PheromoneGoal | undefined;
  private pheromoneToEmit: PheromoneType | undefined;
  private goal: Goal | undefined;
  constructor(map: AntSimulator, pos: Vector2, initialAngle: number) {
    this.position = pos;
    this.angle = initialAngle;
    this.map = map;
    const b = Math.random() > 0.5;
    // this.pheromoneObjective = new SingularPheromoneGoal(b ? PheromoneType.FOOD : PheromoneType.TRACKER);
    // this.pheromoneToEmit = b ? PheromoneType.TRACKER : PheromoneType.FOOD;
    this.goal = new FoodGoal();
    this.pheromoneToEmit = undefined;
    this.pheromoneObjective = undefined;
  }

  runFrame() {
    // console.log(this.emitPheromones);
    // console.log(this.position);

    if (this.goal) {
      if (!this.goal.hasInitialized()) this.goal.initialize(this, this.map);
      if (this.goal.check(this, this.map)) {
        const g = this.goal;
        this.goal = undefined;
        g.onFinish(this, this.map);
      }
    }

    this.updateAngle();
    this.updatePosition();
    if (this.pheromoneToEmit) this.map.addPheromone(this.position, this.pheromoneToEmit);
    // console.log(this.angle);
  }

  private updateAngle() {
    const forward = this.sense(0);
    const left = this.sense(Math.PI / 12);
    const right = this.sense(-Math.PI / 12);
    // console.log(`forward: ${forward}, left: ${left}, right: ${right}`);

    // console.log(`right: ${right}`);
    // console.log(`left: ${left}`);
    // console.log(`forward: ${forward}`);

    if ((right < forward && right < left && right !== 0) || (right > 0 && forward === 0 && left === 0)) {
      // console.log('turn right');

      this.angle -= Math.PI / 12;
    } else if ((left < forward && left < right && left !== 0) || (left > 0 && forward === 0 && right === 0)) {
      // console.log('turn left');

      this.angle += Math.PI / 12;
    }
    // this.angle *= Math.random() * 0.02 + 0.99;
  }

  private updatePosition() {
    // if (this.pheromoneTrail.length > this.map.pheromoneTrailDisappearIterations) this.pheromoneTrail.shift(); // kinda volatile but ehhh

    const newPos = {
      x: this.position.x + Math.cos(this.angle),
      y: this.position.y + Math.sin(this.angle),
    };

    if (newPos.x >= this.map.getWidth() - 1 || newPos.x <= 0 || newPos.y >= this.map.getHeight() - 1 || newPos.y <= 0) {
      this.angle = Math.PI * Math.random() * 2;
    } else {
      this.position = newPos;
    }
  }

  private sense(senseOffset: number): number {
    const sensingAngle = this.angle + senseOffset;
    const sensingPoint = {
      x: this.position.x + Math.cos(sensingAngle) * 5,
      y: this.position.y + Math.sin(sensingAngle) * 5,
    };

    // console.log({ x: Math.round(sensingPoint.x), y: Math.round(sensingPoint.y) });

    // const ctx = this.map.canvas.getContext('2d');
    // // console.log(ctx);

    // if (ctx) {
    //   ctx.fillStyle = 'brown';
    //   // console.log(sensingPoint);

    //   ctx.fillRect(
    //     Math.round(sensingPoint.x) * this.map.unitSize,
    //     Math.round(sensingPoint.y) * this.map.unitSize,
    //     this.map.unitSize,
    //     this.map.unitSize
    //   );
    // }

    try {
      // return this.map.getPheromoneLevel(sensingPoint) * Math.random(); // * random weight
      return this.pheromoneObjective ? this.map.getPheromone(sensingPoint)?.test(this.pheromoneObjective) || 0 : 0;
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

  setPheromoneObjective(obj: PheromoneGoal) {
    this.pheromoneObjective = obj;
  }

  getPheromoneObjective() {
    return this.pheromoneObjective;
  }

  setGoal(goal: Goal) {
    this.goal = goal;
  }

  getGoal() {
    return this.goal;
  }

  setPheromoneToEmit(pheromone: PheromoneType) {
    this.pheromoneToEmit = pheromone;
  }

  getPheromoneToEmit() {
    return this.pheromoneToEmit;
  }
}
