const FaunaService = require('@brianmmdev/faunaservice')

exports.handler = async (event, context) => {
  console.log(JSON.stringify(event))
  console.log(JSON.stringify(context))
  const service = new FaunaService("fnAEHWwaWcACA2OL-nIqxJ2awi5Lp9uivhbmvFdE")
  
  let tasks = await service.listRecords("Tasks")
  let user = context.clientContext.user
  tasks = tasks.filter(t => t.userId === user.sub)

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tasks)
  }
}