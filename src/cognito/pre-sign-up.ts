export default async function preSignUp(event) {
  return {
    ...event,
    response: {
      ...event.response,
      autoConfirmUser: true
    }
  }
}
