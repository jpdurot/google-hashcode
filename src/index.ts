import { Scanner } from './hashcode-tooling/files/scanner';

const scanner = new Scanner('./a_example.in');
while (!scanner.isEndOfFile()) {
    console.log(scanner.nextNumber());
}