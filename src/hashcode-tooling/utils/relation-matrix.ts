import { Matrix, sparse, index } from 'mathjs';
import { IndexDictionary } from './index-dictionary';
import { IRelationMatrix } from './i-relation-matrix';
import math = require('mathjs');

export class RelationMatrix<LineType, ColumnType> implements IRelationMatrix<LineType, ColumnType> {
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

    return this.matrix.get([lineIndex, columnIndex]);
  }

  getRelatedLines(column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);

    return this.matrix
      .subset(index([0, this.lineIndexes.lastIndex], columnIndex))
      .resize([this.lineIndexes.lastIndex + 1], 1);
  }

  getRelatedColumns(line: LineType) {
    const lineIndex = this.lineIndexes.getOrAdd(line);

    return this.matrix
      .subset(index(lineIndex, [0, this.columnIndexes.lastIndex]))
      .resize([1, this.columnIndexes.lastIndex + 1], 0);
  }

  getRelationLineIntersection(firstLine: LineType, secondLine: LineType): number[] {
    const firstLineRelations = this.getRelatedColumns(firstLine);
    const secondLineRelations = this.getRelatedColumns(secondLine);

    return this.getRelationArrayIntersection(firstLineRelations, secondLineRelations);
  }

  getRelationColumnIntersection(firstColumn: ColumnType, secondColumn: ColumnType): number[] {
    const firstColumnRelations = this.getRelatedLines(firstColumn);
    const secondColumnRelations = this.getRelatedLines(secondColumn);

    return this.getRelationArrayIntersection(firstColumnRelations, secondColumnRelations);
  }

  outputSizeAndStorage(): void {
    console.log(`Size: ${this.matrix.size()}, Storage: ${this.matrix.storage()}`);
  }

  outputDensity(): void {
    console.log(this.matrix.density());
  }

  resize(noOfLines: number, noOfColumns: number): void {
    this.matrix.resize([noOfLines, noOfColumns]);
  }

  getRelationLineIntersectionSize(firstLine: LineType, secondLine: LineType): number {
    const firstLineRelations = this.getRelatedColumns(firstLine);
    const secondLineRelations = this.getRelatedColumns(secondLine);

    return math.dot(firstLineRelations, secondLineRelations);
  }
  getRelationColumnIntersectionSize(firstColumn: ColumnType, secondColumn: ColumnType): number {
    const firstColumnRelations = this.getRelatedLines(firstColumn);
    const secondColumnRelations = this.getRelatedLines(secondColumn);

    return math.dot(firstColumnRelations, secondColumnRelations);
  }

  getAllLineIntersectionSizes(intersectedLine: LineType): number[] {
    const intersectedLineRelations = this.getRelatedColumns(intersectedLine);
    const result = math.multiply(this.matrix, math.transpose(intersectedLineRelations));
    return result.toArray() as number[];
  }

  getAllColumnIntersectionSizes(intersectedColumn: ColumnType): number[] {
    const intersectedColumnRelations = this.getRelatedLines(intersectedColumn);

    const result = math.multiply(this.matrix, math.transpose(intersectedColumnRelations));
    return result.toArray() as number[];
  }

  private getRelationArrayIntersection(firstRelationArray: Matrix, secondRelationArray: Matrix): number[] {
    const intersectionSize = Math.max(firstRelationArray.size()[0], secondRelationArray.size()[0]);
    let intersection: number[] = [];
    for (let i = 0; i < intersectionSize; i++) {
      // FIXME not sure about this [i, 0]
      intersection[i] = (firstRelationArray.get([i, 0]) ?? 0) * (secondRelationArray.get([i, 0]) ?? 0);
    }

    return intersection;
  }
}
