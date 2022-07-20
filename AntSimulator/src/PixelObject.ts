import Vector2 from './Vector2';

export default class PixelObject {
  private type: PixelType;
  private pos: Vector2;
  constructor(pos: Vector2, type: PixelType) {
    this.type = type;
    this.pos = pos;
  }

  public getType() {
    return this.type;
  }

  public getPos() {
    return this.pos;
  }
}

export enum PixelType {
  SPAWN = 'rgba(255, 0, 0, 1)',
  FOOD = 'rgba(0, 128, 0, 1)',
}

export function getPixelType(val: string): PixelType | undefined {
  return Object.entries(PixelType).find((v) => v[1] === val)?.[1];
}
