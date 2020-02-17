const EOL = require('os').EOL;

export enum LEVEL {
  LOG,
  ERROR
}

export class Logger {
  public static print(message: string, level = LEVEL.LOG): void {
    switch (level) {
      case LEVEL.LOG:
        process.stdout.write(message);
        break;
      case LEVEL.ERROR:
        process.stderr.write(message);
        break;
    }
  }

  public static printLn(message: string, level = LEVEL.LOG): void {
    Logger.print(message + EOL, level);
  }
}
