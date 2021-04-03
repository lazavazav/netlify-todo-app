<template>
  <div id="app">
    <h1>Vue Todo App</h1>
    <div class="add-task-wrapper">
      <input type="text" v-model="newTaskInput" @keydown.enter="addTask">
      <button @click="addTask">Add task</button>
    </div>
    <div class="task" v-for="task in tasks" :key="task.id">
      <div class="task-main">
        <span>{{ task.name }}</span>
        <span class="buttons">
          <button @click="removeTask(task.id)">❌</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      tasks: [],
      newTaskInput: ""
    }
  },
  async created() {
    let response = await fetch("https://clever-bhaskara-8b1e3b.netlify.app/.netlify/functions/listtasks")
    this.tasks = await response.json()
  },
  methods: {
    async addTask() {
      let response = await fetch("https://clever-bhaskara-8b1e3b.netlify.app/.netlify/functions/addtask", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.newTaskInput
        })
      })

      let newTask = await response.json()
      this.tasks.push(newTask)
      this.newTaskInput = ""
    },

    async removeTask(taskId) {
      await fetch("https://clever-bhaskara-8b1e3b.netlify.app/.netlify/functions/deletetask", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: taskId
        })
      })
      this.tasks = this.tasks.filter(t => t.id !== taskId)
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  max-width: 500px;
  margin: 0 auto;
}

button, input {
  border-radius: 5px;
  padding: 5px 10px;
  border: 1px solid #aaa;
  margin: 5px;
}

.add-task-wrapper {
  display: flex;
}

.add-task-wrapper input {
  flex: 1
}

.task {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: #eee;
  border-radius: 5px;
  margin: 5px 10px;
  padding: 5px 10px;
}

.task-main {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-img img {
  max-width: 40%;
  border: 1px solid white;
}
</style>
