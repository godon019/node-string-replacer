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


## bug
```
&.danger {
  color: $text-dark;
  border: 1px solid $warm-pink;
  background-color: $warm-pink;
}

// after first run
&.danger {
  color: ${({ theme }) => theme.colors.textDark};
  border: 1px solid ${({ theme }) => theme.colors.warmPink};
  background-color: $warm-pink;
}
```
here the last $warm-pink doesn't change at first execution
so I have to run it twice