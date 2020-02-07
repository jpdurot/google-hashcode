# Hashcode 2020

## How to

### Prerequisites
Use npm version 12

### Build solution
Launch one of the competitions, for example `2020-training`, by providing one or multiple generator names. Ex:
```shell script
node dist/competitions/2020-training/src/index.js -g random
```

Will read input files from
```shell script
dist/competitions/2020-training/input
```
and write solution files to
```shell script
dist/competitions/2020-training/output
```

### Update graphs
```shell script
node dist/hashcode-tooling/graph/solution-graph.js
```
### Serve graphs
```shell script
npx http-server ./src/hashcode-tooling/graph
```
