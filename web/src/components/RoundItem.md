A compact view of an item.

Three Actions:
```js
<RoundItem
  label="Click Me"
  actions={[{label: 'Edit'}, {label: 'Tag'}, {label: 'Delete'}]}
/>
```

Two Actions:
```js
<RoundItem
  label="Click Me"
  actions={[{label: 'Open'}, {label: 'Tag'}]}
/>
```

One Action:
```js
<RoundItem
  label="Click Me"
  actions={[{label: 'Open'}]}
/>
```

Action Below:
```js
<RoundItem
  label="Click Me"
  actions={[{label: 'Open', position: 'bottom'}]}
/>
```
