export default class AnimateValue {
  constructor({ duration, delay, from, to, fps }) {
    this._duration = duration;
    this._delay = delay;
    this._from = from;
    this._to = to;
    this._totalFrames = duration * (fps - 1);

    this._difference = to - from;
    this._increment = this._difference / this._totalFrames;

    this._currentFrame = 0;
    this._isStopped = true;
    this._isPlaying = false;
  }
  play(cb) {
    let frame = this._currentFrame;
    if (frame < this._totalFrames) {
      this._isStopped = false;
      this._isPlaying = true;
      this._currentFrame++;
      return this._valuesArr[frame];
    } else {
      this._isStopped = true;
      this._isPlaying = false;
      cb();
      return this._valuesArr[this._totalFrames];
    }
  }
}
