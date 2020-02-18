import { IndexDictionary } from './index-dictionary';
import { IRelationMatrix } from './i-relation-matrix';

export class PrimitiveRelationMatrix<LineType, ColumnType> implements IRelationMatrix<LineType, ColumnType> {
  columnIndexes = new IndexDictionary<ColumnType>();
  lineIndexes = new IndexDictionary<LineType>();

  matrix: number[][] = [[]];

  constructor() {}

  set(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    if (!this.matrix[lineIndex]) {
      this.matrix[lineIndex] = [];
    }
    this.matrix[lineIndex][columnIndex] = 1;
  }

  unset(line: LineType, column: ColumnType) {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    this.matrix[lineIndex][columnIndex] = 0;
  }

  getRelation(line: LineType, column: ColumnType): number {
    const columnIndex = this.columnIndexes.getOrAdd(column);
    const lineIndex = this.lineIndexes.getOrAdd(line);

    return this.matrix[lineIndex][columnIndex] ?? 0;
  }

  getRelatedLines(column: ColumnType): number[] {
    const columnIndex = this.columnIndexes.getOrAdd(column);

    return this.matrix.map(line => line[columnIndex]);
  }

  getRelatedColumns(line: LineType): number[] {
    const lineIndex = this.lineIndexes.getOrAdd(line);

    return this.matrix[lineIndex];
  }

  getRelationLineIntersectionSize(firstLine: LineType, secondLine: LineType): number {
    return this.getRelationLineIntersection(firstLine, secondLine).reduce((a, b) => a + b);
  }
  getRelationColumnIntersectionSize(firstColumn: ColumnType, secondColumn: ColumnType): number {
    return this.getRelationColumnIntersection(firstColumn, secondColumn).reduce((a, b) => a + b);
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

  getRelationLineDifference(firstLine: LineType, secondLine: LineType): number[] {
    const firstLineRelations = this.getRelatedColumns(firstLine);
    const secondLineRelations = this.getRelatedColumns(secondLine);

    return this.getRelationArrayDifference(firstLineRelations, secondLineRelations);
  }

  getRelationColumnDifference(firstColumn: ColumnType, secondColumn: ColumnType): number[] {
    const firstColumnRelations = this.getRelatedLines(firstColumn);
    const secondColumnRelations = this.getRelatedLines(secondColumn);

    return this.getRelationArrayDifference(firstColumnRelations, secondColumnRelations);
  }

  getRelationLineUnion(firstLine: LineType, secondLine: LineType): number[] {
    const firstLineRelations = this.getRelatedColumns(firstLine);
    const secondLineRelations = this.getRelatedColumns(secondLine);

    return this.getRelationArrayUnion(firstLineRelations, secondLineRelations);
  }

  getRelationColumnUnion(firstColumn: ColumnType, secondColumn: ColumnType): number[] {
    const firstColumnRelations = this.getRelatedLines(firstColumn);
    const secondColumnRelations = this.getRelatedLines(secondColumn);

    return this.getRelationArrayUnion(firstColumnRelations, secondColumnRelations);
  }

  getAllLineIntersectionSizes(intersectedLine: LineType): number[] {
    throw new Error('Method not implemented.');
  }
  getAllColumnIntersectionSizes(intersectedColumn: ColumnType): number[] {
    throw new Error('Method not implemented.');
  }

  private getRelationArrayUnion(firstRelationArray: number[], secondRelationArray: number[]): number[] {
    const unionSize = Math.max(firstRelationArray.length, secondRelationArray.length);
    let union: number[] = [];
    for (let i = 0; i < unionSize; i++) {
      union[i] = (firstRelationArray[i] ?? 0) + (secondRelationArray[i] ?? 0) > 0 ? 1 : 0;
    }

    return union;
  }

  private getRelationArrayIntersection(firstRelationArray: number[], secondRelationArray: number[]): number[] {
    const intersectionSize = Math.max(firstRelationArray.length, secondRelationArray.length);
    let intersection: number[] = [];
    for (let i = 0; i < intersectionSize; i++) {
      intersection[i] = (firstRelationArray[i] ?? 0) * (secondRelationArray[i] ?? 0);
    }

    return intersection;
  }

  private getRelationArrayDifference(firstRelationArray: number[], secondRelationArray: number[]) {
    const differenceSize = Math.max(firstRelationArray.length, secondRelationArray.length);
    let difference: number[] = [];
    for (let i = 0; i < differenceSize; i++) {
      difference[i] = (firstRelationArray[i] ?? 0) - (secondRelationArray[i] ?? 0);
    }

    return difference;
  }
}
