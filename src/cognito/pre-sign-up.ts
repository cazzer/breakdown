import epsagon from '../epsagon'

export default epsagon.lambdaWrapper(async (event) => ({
  ...event,
  response: {
    ...event.response,
    autoConfirmUser: true
  }
}))
