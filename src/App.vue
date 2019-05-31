<template>
  <div id="app">
    <h1 class="txt-center">Simple Todo App</h1>

    <h2 class="txt-center" v-if="!todos.length">Add a todo to get started</h2>

    <input type="text" placeholder="Search Todos" v-if="todos.length" v-model="query">

    <ul class="todos">
      <li v-for="(todo, i) in filteredTodos" :key="i" class="todo">
        <div class="edit-todo-container" v-if="todo.edit">
          <input type="text" v-model="todo.content" name="update">
          <button @click="saveTodo(todo);" class="save">Save</button>
        </div>
        <div class="todo-container" v-else>
          <div class="todo-info">
            <button @click="completeTodo(todo, i);" class="done-btn">done</button>
            <p>{{ todo.content }}</p>
          </div>
          <div class="btns">
            <button @click="deleteTodo(todo.id, i);" class="destroy">X</button>
            <button @click="updateTodo(todo);" class="edit-btn">Edit</button>
          </div>
        </div>
      </li>
    </ul>

    <form @submit.prevent="addTodo">
      <input v-model="todo" type="text" placeholder="New Todo">
      <button type="submit">Add</button>
    </form>

    <div class="completed" v-if="completedTodos.length">
      <div class="completed-title">
        <h3>Completed Todos</h3>
        <button class="clear-btn" @click="clearAll">Clear All</button>
      </div>

      <ul class="completed-todos">
        <li v-for="(todo, i) in completedTodos" :key="i">
          <p>{{ todo.content }}</p>
          <button @click="undo(todo, i);">undo</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "App",
  data: () => ({
    todo: "",
    todos: [],
    completedTodos: [],
    query: ""
  }),
  computed: {
    filteredTodos() {
      const todos = this.todos.filter(todo =>
        todo.content.toLowerCase().match(this.query.toLowerCase())
      );
      return todos;
    }
  },
  created() {
    this.getTodos();
  },
  methods: {
    getTodos() {
      axios.get("http://localhost:3000/todos").then(todos => {
        todos.data.forEach(todo => {
          if (todo.completed) {
            this.completedTodos.push(todo);
          } else {
            this.todos.push(todo);
          }
        });
      });
    },
    addTodo() {
      const todo = {
        content: this.todo,
        completed: false,
        edit: false
      };
      axios({
        method: "POST",
        url: "http://localhost:3000/todos",
        data: JSON.stringify(todo),
        headers: {
          "Content-type": "application/json"
        }
      }).then(todo => {
        console.log(todo.data);
        this.todos.push(todo.data);
      });

      this.todo = "";
    },

    deleteTodo(id, index) {
      axios({
        method: "DELETE",
        url: `http://localhost:3000/todos/${id}`
      }).then(todo => {
        console.log(todo.data);
        this.todos.splice(index, 1);
      });
    },

    updateTodo(todo) {
      todo.edit = !todo.edit;
    },

    saveTodo(todo) {
      const updatedTodo = {
        id: todo.id,
        content: todo.content,
        completed: todo.completed,
        edit: !todo.edit
      };
      axios({
        method: "PUT",
        url: `http://localhost:3000/todos/${todo.id}`,
        data: updatedTodo,
        headers: {
          "Content-type": "application/json"
        }
      })
        .then(res => {
          console.log("Todo updated");
          console.log(res.data);
        })
        .catch(err => console.log(err));
      this.updateTodo(todo);
    },

    completeTodo(todo, index) {
      const updatedTodo = {
        id: todo.id,
        content: todo.content,
        completed: !todo.completed,
        edit: todo.edit
      };
      axios({
        method: "PUT",
        url: `http://localhost:3000/todos/${todo.id}`,
        data: updatedTodo,
        headers: {
          "Content-type": "application/json"
        }
      })
        .then(res => {
          console.log("Todo completed");
          console.log(res.data);
          this.completedTodos.push(todo);
          this.todos.splice(index, 1);
        })
        .catch(err => console.log(err));
    },

    clearAll() {
      this.completedTodos = [];
    },

    undo(todo, index) {
      const updatedTodo = {
        id: todo.id,
        content: todo.content,
        completed: !todo.completed,
        edit: todo.edit
      };
      axios({
        method: "PUT",
        url: `http://localhost:3000/todos/${todo.id}`,
        data: updatedTodo,
        headers: {
          "Content-type": "application/json"
        }
      })
        .then(res => {
          console.log("Todo completed");
          console.log(res.data);
          this.completedTodos.splice(index);
          this.todos.push(todo);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
#app {
  width: 60%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.txt-center {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

form button {
  cursor: pointer;
}

.completed {
  margin-top: 20px;
}

.completed-title {
  display: flex;
  align-items: center;
}

.completed-title h3 {
  margin: 0px;
}

.completed-title .clear-btn {
  margin-left: 10px;
  cursor: pointer;
}

.todos,
.completed-todos {
  list-style: none;
  padding: 0px;
}

.completed-todos li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.completed-todos li p {
  margin: 0px;
}

.completed-todos li button {
  margin-left: 10px;
  cursor: pointer;
}

.todo-container,
.edit-todo-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-todo-container,
.todo-container {
  margin-bottom: 10px;
}

.todo-container p {
  margin: 0px;
}

.edit-btn {
  margin-left: 10px;
}

.done-btn {
  margin-right: 10px;
}

.todo-info {
  display: flex;
  align-items: center;
}

.todo p {
  margin-right: 10px;
}

.todo button {
  cursor: pointer;
}
</style>

 // "todos": [
  //   {
  //     "id": "1",
  //     "content": "My first todo",
  //     "completed": false,
  //     "edit": false
  //   },
  //   {
  //     "id": "2",
  //     "content": "My second todo",
  //     "completed": false,
  //     "edit": false
  //   },
  //   {
  //     "id": "3",
  //     "content": "My third todo",
  //     "completed": false,
  //     "edit": false
  //   },
  //   {
  //     "id": "4",
  //     "content": "My fourth todo",
  //     "completed": false,
  //     "edit": false
  //   },
  //   {
  //     "id": "5",
  //     "content": "My fifth todo",
  //     "completed": false,
  //     "edit": false
  //   }
  // ]