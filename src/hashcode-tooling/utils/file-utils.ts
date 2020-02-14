import * as fs from 'fs';

export function readFilesFrom(dirName: string) {
  return fs.readdirSync(dirName, { withFileTypes: true }).filter(f => !f.isDirectory());
}

export const writeFile = (fileName: string, content: string | undefined) => {
  fs.writeFile(fileName, content, () => console.log(`Written: ${fileName}`));
};
