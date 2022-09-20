# Contracts

For creating particules

## Block contract

```js
{
  // Address
  address: createAddress(),
  // Always 'Block:' then Flex, Anchor, ...
  role: 'Block:Flex',
  // Typically empty
  payload: {},
  // Your block component
  workload: Flex,
}
```

Mandatory blocks roles are:
- Block:Master (the topmost component, typically a theme wrapper)
- Block:Flex
- Block:Anchor
- Block:Button

The workload will be passed the following props: `style`, `behavior` and `children`

## Block behavior contract

...
