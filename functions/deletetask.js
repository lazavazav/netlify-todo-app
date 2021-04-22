const FaunaService = require('@brianmmdev/faunaservice')

exports.handler = async (event, context) => {
  let user = context.clientContext.user
  const service = new FaunaService("fnAEHW6T8VAGA3WSswOuoVy-s66wwLMk0VnIhXmW")

  let body = JSON.parse(event.body)

  let task = service.getRecordById("Tasks", body.id)
  if(task && task.userId == user.sub) {
    await service.deleteRecord("Tasks", body.id)
  }
  
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type"
    }
  }
}