<template>
  <div id="app">
    <div class="header">
      <h1>Sasa Demo App</h1>
      <div data-netlify-identity-menu></div>
      <button type="button" class="identity-signup">Signup</button>
      <button type="button" class="identity-login">Login</button>
      <button type="button" class="identity-logout">Logout</button>
    </div>
    <div v-if="isLoggedIn">
      <div class="add-task-wrapper">
        <input type="text" v-model="newTaskInput" @keydown.enter="addTask" />
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
    <div v-else>Please log in.</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      tasks: [],
      newTaskInput: '',
      isLoggedIn: false,
      token: '',
    };
  },
  async created() {
    const self = this;
    // eslint-disable-next-line no-undef
    netlifyIdentity.on('init', async (user) => {
      if (user) {
        self.token = user.token.access_token;
        await self.listTasks();
        self.isLoggedIn = true;
      }
    });

    // eslint-disable-next-line no-undef
    netlifyIdentity.on('login', async (user) => {
      self.token = user.token.access_token;
      await self.listTasks();
      self.isLoggedIn = true;
    });

    // eslint-disable-next-line no-undef
    netlifyIdentity.on('logout', () => {
      self.isLoggedIn = false;
      self.newTaskInput = '';
      self.tasks = [];
      self.token = '';
    });
  },
  methods: {
    async listTasks() {
      let response = await fetch('/.netlify/functions/listtasks', {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      this.tasks = await response.json();
    },

    async addTask() {
      let response = await fetch('/.netlify/functions/addtask', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          name: this.newTaskInput,
        }),
      });

      let newTask = await response.json();
      this.tasks.push(newTask);
      this.newTaskInput = '';
    },

    async removeTask(taskId) {
      await fetch('/.netlify/functions/deletetask', {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          id: taskId,
        }),
      });
      this.tasks = this.tasks.filter((t) => t.id !== taskId);
    },
  },
};
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

button,
input {
  border-radius: 5px;
  padding: 5px 10px;
  border: 1px solid #aaa;
  margin: 5px;
}

.add-task-wrapper {
  display: flex;
}

.add-task-wrapper input {
  flex: 1;
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
