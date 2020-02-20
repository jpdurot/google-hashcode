import * as fs from 'fs';

export function readFilesFrom(dirName: string): fs.Dirent[] {
  return fs.readdirSync(dirName, { withFileTypes: true }).filter(f => !f.isDirectory());
}

export const writeFile = (fileName: string, content: string | undefined) => {
  fs.writeFileSync(fileName, content);
  console.log(`Written: ${fileName}`);
};
