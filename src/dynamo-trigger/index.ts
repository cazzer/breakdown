import epsagon from '../epsagon'

export default epsagon.lambdaWrapper((event: any) => {
  console.log(event)
  event.Records.forEach(record => {
    console.log(record.dynamodb)
    console.log(record.userIdentity)
  })
})
