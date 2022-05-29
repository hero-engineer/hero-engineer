function Space(address: string) {

}

type ParticuleType<P> = {
  address: string
  payload: P
  children: Record<string, (p: ParticuleType<P>) => void>
  _: <X>(key?: string) => ParticuleType<X> | P
  addChild<X>(particule: ParticuleType<X>): void
}

function Particule<P = unknown>(address: string, init: (p: ParticuleType<P>) => void = () => {}): ParticuleType<P> {
  console.log('address', address);

  const children = { init }

  const move = {
    address,
    children,
    payload: null as P,
    _(key?: string) {
      if (typeof key === 'string' && key) {
        const keyArray = key.split('.')
        const childAddress = keyArray.shift()

        if (typeof children[childAddress] === 'function') {
          return children[childAddress](keyArray.join('.'))
        }
      }

      return null
    },
    addChild<X>(particule: ParticuleType<X>) {
      children[particule.address] = particule
    },
  }

  init(move)

  return move
}

const canvas = Particule('canvas')

const context = Particule<CanvasRenderingContext2D>('context', (p) => {
  p.payload = {} as CanvasRenderingContext2D
})

canvas.addChild(context)

const draw = Particule('draw', (p) => {
  console.log('draw');

  const _ = context.payload

  _.fillStyle = 'red'

  console.log('_', _);
})

canvas.addChild(draw)

canvas._('draw')

// console.log('context', context);
