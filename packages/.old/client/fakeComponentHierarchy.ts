export default {
  name: 'App',
  domPAttern: {
    tag: 'div', // #root
    children: [
      { isChildren: true },
    ],
  },
  children: [
    {
      name: 'Mycomponent1',
      domPattern: {
        tag: 'div',
        children: [
          { tag: 'p' },
          { isChildren: true },
          { tag: 'p' },
        ],
      },
      children: [
        {
          name: 'Mycomponent2',
          domPattern: { tag: 'div' },
        },
      ],
    },
    {
      name: 'Mycomponent3',
      domPattern: { tag: 'div' },
    },
  ],
}
