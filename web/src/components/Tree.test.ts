import { calculateDimensions, calculateDepths } from './Tree'

describe('Calculate Depths', () => {
  it('Returns nothing for an empty array', () => {
    expect(calculateDepths([])).toEqual({})
  })

  it('Returns depth for a single element', () => {
    expect(
      calculateDepths([{ id: '1' }])
    ).toEqual({1: 0})
  })

  it('Returns depth of 2 for children', () => {
    expect(
      calculateDepths([
        { id: '1' },
        { id: '2', parent: '1' },
        { id: '3', parent: '1' }
      ])
    ).toEqual({ 1: 0, 2: 1, 3: 1 })
  })

  it('Returns depth of 3 for children of children', () => {
    expect(
      calculateDepths([
        { id: '1' },
        { id: '2', parent: '1' },
        { id: '3', parent: '2' }
      ])
    ).toEqual({ 1: 0, 2: 1, 3: 2 })
  })

  it('Returns correct depth for unordered children', () => {
    expect(
      calculateDepths([
        { id: '3', parent: '2' },
        { id: '2', parent: '1' },
        { id: '1' }
      ])
    ).toEqual({ 1: 0, 2: 1, 3: 2 })
  })
})

// describe('Calculate Coodinates', () => {
//   it('Fits an two items under a parent', () => {
//     expect(
//       calculateDimensions([
//         { id: '3', parent: '2' },
//         { id: '2', parent: '1' },
//         { id: '1' }
//       ], 2, 10)
//     ).toEqual({
//       coordinates: { 1: [5, 0], 2: [0, 10], 3: [10, 10] },
//       height: 20,
//       width: 20
//     })
//   })
// })
