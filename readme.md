# Hashcode 2020

## How to

### Prerequisites
Use npm version 12

### Configure competition
`package.json`: update exercise name

```json
{
  "currentExercise": "2020-training"
}
```

### Windaube

If running on windows, prefix all npm targets with `win:`
Example:
```shell script
npm run win:graph:serve
```

### Build solution
Start TS Code watch (build automatically when code changes)
```shell script
npm run watch
```

### Update graphs
```shell script
npm run graph:watch
```
(and open http://127.0.0.1:8080)

### Serve graphs
```shell script
npm run graph:serve
```

### RUN!!
Launch the calculation, providing the generator name
```shell script
npm run go -- -g random
```
All files will be imported, unless you provide one or many specific filenames (basename)

Ex:
```shell script
npm run go -- -g random -f kittens.in -f me_at_the_zoo.in
```

If competition is set to `2020-training`, will read input files from:
```shell script
dist/competitions/2020-training/input
```
and write solution files to
```shell script
dist/competitions/2020-training/output
```
## Strategy

1. share common understanding of exercise
2. modelize basic input
3. modelize output
3. modelize score calculation
3. modelize dumb generator
4. in parallel:
   1. code input
   2. code output
   3. code dumb generator
6. submit to judge system
7. modelize advanced generator
    4. modelize intermediate advanced input
    1. define different steps (ex: remove one dimension in inputs)
7. iterate...

