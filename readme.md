## process
read from file then match with regex pattern
and change as I wish

```js
const read = () => {
  //...
}
// read();
```
when testing read, don't forget uncomment `read()` 


## using `strng.prototype.matchAll` package separately
[link](https://www.npmjs.com/package/string.prototype.matchall)
since `matchAll()` is available only after node version 12, I decided to use it as seperate package for compatibility

## how to use
```
node index.js --path 'absolute path here'
```