import { sparse } from 'mathjs';
import { IndexDictionary } from './index-dictionary';

export class RelationMatrix<LineType, ColumnType> {
  columnIndexes = new IndexDictionary<ColumnType>();
  lineIndexes = new IndexDictionary<LineType>();

  matrix = sparse();

  constructor() {}

  set(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix.set([lineIndex, columnIndex], 1);
  }

  unset(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix.set([lineIndex, columnIndex], 0);
  }

  getRelation(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix.get([lineIndex, columnIndex]);
  }

  getRelatedLines(column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);

    this.matrix.subset([0, this.lineIndexes.lastIndex], columnIndex);
  }

  getRelatedColumns(line: LineType) {
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix.subset(lineIndex, [0, this.columnIndexes.lastIndex]);
  }

  outputSizeAndStorage(): void {
    console.log(`Size: ${this.matrix.size()}, Storage: ${this.matrix.storage()}`);
  }
}
