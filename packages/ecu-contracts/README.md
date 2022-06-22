# Contracts

For creating particules

## Block contract

```js
{
  address: createAddress(),
  role: 'Block:Flex', // Always 'Block:' then Flex, Anchor, ...
  payload: {},
  workload: wrapEcu(Flex),
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
