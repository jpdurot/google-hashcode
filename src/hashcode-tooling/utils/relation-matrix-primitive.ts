import { sparse } from 'mathjs';
import { IndexDictionary } from './index-dictionary';

export class RelationMatrix<LineType, ColumnType> {
  columnIndexes = new IndexDictionary<ColumnType>();
  lineIndexes = new IndexDictionary<LineType>();

  matrix: number[][] = [[]];

  constructor() {}

  set(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix[lineIndex][columnIndex] = 1;
  }

  unset(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix[lineIndex][columnIndex] = 0;
  }

  getRelation(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    return this.matrix[lineIndex][columnIndex] ?? 0;
  }

  getRelatedLines(column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);

    return this.matrix.map(line => line[columnIndex]);
  }

  getRelatedColumns(line: LineType) {
    const lineIndex = this.lineIndexes.getOrAdd(line);

    return this.matrix[lineIndex];
  }
}
