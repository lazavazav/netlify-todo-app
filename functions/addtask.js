const FaunaService = require('@brianmmdev/faunaservice')

exports.handler = async (event, context) => {
  let user = context.clientContext.user
  const service = new FaunaService("fnAEHW6T8VAGA3WSswOuoVy-s66wwLMk0VnIhXmW")

  let task = JSON.parse(event.body)
  task.userId = user.sub

  let created = await service.createRecord("Tasks", task)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(created)
  }
}