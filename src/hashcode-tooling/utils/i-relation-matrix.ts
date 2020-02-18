export interface IRelationMatrix<LineType, ColumnType> {
  set(line: LineType, column: ColumnType): void;

  unset(line: LineType, column: ColumnType): void;

  getRelation(line: LineType, column: ColumnType): number;

  getRelationLineIntersection(firstLine: LineType, secondLine: LineType): number[];

  getRelationColumnIntersection(firstColumn: ColumnType, secondColumn: ColumnType): number[];

  getRelationLineIntersectionSize(firstLine: LineType, secondLine: LineType): number;

  getRelationColumnIntersectionSize(firstColumn: ColumnType, secondColumn: ColumnType): number;
}
