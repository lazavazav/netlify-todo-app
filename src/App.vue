<template>
  <div id="app">
    <div class="header">
      <h1>Vue Todo App</h1>
      <div data-netlify-identity-menu></div>
    </div>
    <div v-if="isLoggedIn">
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
    <div v-else>
      Please log in to view tasks.
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      tasks: [],
      newTaskInput: "",
      isLoggedIn: false
    }
  },
  async created() {
    const self = this
    // eslint-disable-next-line no-undef
    netlifyIdentity.on('init', async function(user) {
      if(user) {
        await self.fetchTasks()
        self.isLoggedIn = true
      }
    })

    // eslint-disable-next-line no-undef
    netlifyIdentity.on('login', function() {
      self.isLoggedIn = true
    })

    // eslint-disable-next-line no-undef
    netlifyIdentity.on('logout', function() {
      self.newTaskInput = ""
      self.tasks = []
      self.isLoggedIn = false
    })
  },
  methods: {
    async fetchTasks() {
      // eslint-disable-next-line no-undef
      let user = netlifyIdentity.currentUser()
      
      let response = await fetch("/.netlify/functions/listtasks", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token.access_token}`
          },
      })
      self.tasks = await response.json()
    },

    async addTask() {
      // eslint-disable-next-line no-undef
      let user = netlifyIdentity.currentUser()

      let response = await fetch("/.netlify/functions/addtask", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token.access_token}`
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
      // eslint-disable-next-line no-undef
      let user = netlifyIdentity.currentUser()

      await fetch("/.netlify/functions/deletetask", {
        method: "delete",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token.access_token}`
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

.header {
  display: flex;
  justify-content: space-between;
}
</style>
