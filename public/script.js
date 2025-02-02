const todoInput = document.getElementById("todo-input");
const table = document.getElementById("todo-list");
const insertButton = document.getElementById("inserisci");

let todos = [];

const rowTemplate = '<tr id="%ID"><td>%NOME</td><td><button class= "button" type="button" id="completato_%ID">%TEST</button></td><td><button class= "button" type="button" id="delete_%ID">Elimina</button></td></tr>'

const send = (todo) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/add", {
         method: 'POST',
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(todo)
      })
      .then((response) => response.json())
      .then((json) => {
         resolve(json); // risposta del server all'aggiunta
      })
   })
}

const load = () => {
   return new Promise((resolve, reject) => {
      fetch("/todo")
      .then((response) => response.json())
      .then(data => resolve(data));
   })
}

const completeTodo = (todo) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/complete", {
         method: 'PUT',
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify(todo)
      })
      .then((response) => response.json())
      .then((json) => {
         resolve(json);
      })
   })
}

const deleteTodo = (id) => {
   return new Promise((resolve, reject) => {
      fetch("/todo/"+ id , {
         method: 'DELETE',
         headers: {
            "Content-Type": "application/json"
         },
      })
      .then((response) => response.json())
      .then((json) => resolve(json))
   })
}

const render = () => {
   let newHtml = "<thead><td><h2>ToDo</h2></td></thead>";
   
   todos.forEach((e) => {
      let row = rowTemplate
         .replace("%ID", e.id)
         .replace("%ID", e.id)
         .replace("%ID", e.id)
         .replace("%NOME", e.name)
         .replace("%TEST", e.done ? "Completato" : "Completa");

      newHtml += row;
   });
   table.innerHTML = newHtml;

   const buttons = document.querySelectorAll(".button");

   buttons.forEach((button) => {
      if (button.id.includes("completato")) {
         button.onclick = () => {
            const todo = todos.find((e) => e.id === button.id.replace("completato_", ""));
            completeTodo(todo)
               .then(() => load())
               .then(data => {
                  todos = data.todos;
                  render();
               });
         };
      }
      else if (button.id.includes("delete")) {
         button.onclick = () => {
            deleteTodo(button.id.replace("delete_", ""))
               .then(() => load())
               .then(data => {
                  todos = data.todos;
                  render();
               });
         };
      }
   });
};


insertButton.onclick = () => {
   const todo = {          
      name: todoInput.value,
      completed: false
   }  
   send(todo) // 1. invia la nuova Todo
    .then(() => load()) // 2. caricala nuova lista
    .then((json) => { 
      todos = json.todos;
      todoInput.value = "";
      render();  // 3. render della nuova lista
   });
}

load().then((json) => {
   todos = json.todos;
   render();
});

setInterval(() => {
   load().then((json) => {
      todos = json.todos;
      todoInput.value = "";
      render();
   });
}, 30000);