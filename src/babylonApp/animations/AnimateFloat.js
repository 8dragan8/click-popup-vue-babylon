import AnimateValue from "./AnimateValue";

export default class AnimateFloat extends AnimateValue {
  constructor(settings) {
    super(settings);

    this._difference = this._to - this._from;

    this._increment = this._difference / this._totalFrames;

    this._valuesArr = [];
    this._generateValues();
  }

  _generateValues() {
    this._valuesArr.push(this._from);
    for (let i = 1; i < this._totalFrames; i++) {
      this._valuesArr.push(this._valuesArr[i - 1] + this._increment);
    }
    this._valuesArr.push(this._to);
  }
}
