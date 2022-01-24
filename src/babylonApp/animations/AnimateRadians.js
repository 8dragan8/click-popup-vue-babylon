import AnimateValue from "./AnimateValue";

export default class AnimateRadians extends AnimateValue {
  constructor(settings) {
    super(settings);

    this._turns = Math.floor(this._from / (Math.PI * 2));
    this._fromNormalized = this._from % (Math.PI * 2);

    this._difference = this._to - this._fromNormalized;

    this._increment = this._difference / this._totalFrames;

    this._valuesArr = [];
    this._generateValues();
  }

  _generateValues() {
    this._valuesArr.push(this._from);
    for (let i = 1; i < this._totalFrames; i++) {
      this._valuesArr.push(this._valuesArr[i - 1] + this._increment);
    }
    this._valuesArr.push(this._to + this._turns * Math.PI * 2);
  }
}
