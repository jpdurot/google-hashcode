import { Dictionary } from 'typescript-collections';

export class IndexDictionary<T> {
  _dictionary = new Dictionary<T, number>();
  _lastIndex = -1;

  get size(): number {
    return this._lastIndex;
  }

  get(t: T): number | undefined {
    return this._dictionary.getValue(t);
  }

  unset(t: T): void {
    this._dictionary.remove(t);
  }

  add(t: T): number {
    let index = this._lastIndex++;
    this._dictionary.setValue(t, index);
    return index;
  }

  getOrAdd(t: T): number {
    return this.get(t) || this.add(t);
  }
}
