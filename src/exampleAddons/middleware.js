export const print1 = (storeAPI) => (next) => (action) => {
  console.log('1')
  return next(action)
}

export const print2 = (storeAPI) => (next) => (action) => {
  console.log('2')
  return next(action)
}

export const print3 = (storeAPI) => (next) => (action) => {
  console.log('3')
  return next(action)
}

export function logActionAndOutcome(storeAPI) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      console.log('Dispatched action', action)

      const result = next(action)

      console.log('Next state', storeAPI.getState())

      return result
    }
  }
}
