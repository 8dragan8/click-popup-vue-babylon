import { Vector3 } from "@babylonjs/core/Legacy/legacy";
import AnimateValue from "./AnimateValue";

export default class AnimateVector extends AnimateValue {
  constructor(settings) {
    super(settings);

    this._difference = this._from.subtract(this._to);

    this._increment = this._difference.divide(
      new Vector3(
        this._totalFrames,
        this._totalFrames,
        this._totalFrames
      ).negate()
    );

    this._valuesArr = [];
    this._generateValues();
  }

  _generateValues() {
    this._valuesArr.push(this._from);
    for (let i = 1; i < this._totalFrames; i++) {
      this._valuesArr.push(this._valuesArr[i - 1].add(this._increment));
    }
    this._valuesArr.push(this._to);
  }
}
