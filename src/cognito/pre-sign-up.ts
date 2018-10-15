import epsagon from '../epsagon'

export default epsagon.lambdaWrapper(async (event) => {
  return {
    ...event,
    response: {
      ...event.response,
      autoConfirmUser: true
    }
  }
})
