import epsagon from './epsagon'

export default epsagon.lambdaWrapper((event: any) => {
  console.log(event)
})
