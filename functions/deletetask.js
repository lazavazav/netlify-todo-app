const FaunaService = require('@brianmmdev/faunaservice')

exports.handler = async (event, context) => {
  const service = new FaunaService("fnAEFBljzbACAHwvXdujWrjylUlSLaU7GwtMIifc")

  let body = JSON.parse(event.body)
  
  await service.deleteRecord("Tasks", body.id)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type"
    }
  }
}