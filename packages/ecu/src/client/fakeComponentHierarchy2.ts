export default [
  {
    meta: 'App',
    tag: 'div',
    children: [
      {
        meta: 'Mycomponent1',
        tag: 'div',
        children: [
          {
            tag: 'p',
            children: [
              {
                text: true,
              },
            ],
          },
          {
            meta: 'Mycomponent2',
            tag: 'p',
            many: true,
            children: [
              {
                text: true,
              },
            ],
          },
          {
            tag: 'p',
            children: [
              {
                text: true,
              },
            ],
          },
        ],
      },
      {
        meta: 'Mycomponent3',
        tag: 'div',
        children: [
          {
            text: true,
          },
          {
            tag: 'br',
          },
          {
            tag: 'a',
            children: [
              {
                text: true,
              },
            ],
          },
        ],
      },
    ],
  },
]
