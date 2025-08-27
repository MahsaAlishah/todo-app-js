// form => submit => create new Todo =>{id,createdAt,title,iscompleted}
// const todos= []=> todos.push(...)

let filterValue = "all";

//* selecting elements
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todoList");
const selectFilters = document.querySelector(".filter-todos");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const editTodoInput = document.querySelector(".edit-input");

//* Adding event listener to the form
todoForm.addEventListener("submit", addNewTodo);
selectFilters.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});

document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});

function addNewTodo(e) {
  e.preventDefault();

  // Ensure the input is not empty
  if (!todoInput.value) return null;

  // Create a new todo object
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };

  // Add the new todo to the list
  // todos.push(newTodo);
  saveTodo(newTodo);

  filterTodos();
}

function createTodos(todos) {
  // Generate the HTML for the todo list
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
          <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
          <span class="todo__createdAt">${new Date(
            todo.createdAt
          ).toLocaleDateString("fa-IR")}</span>
          <button class="todo__check" data-todo-id=${
            todo.id
          }><i class="far fa-check-square"></i></button>
          <button class="todo__edit" data-todo-id=${
            todo.id
          } ><i class="fas fa-pen"></i></button>
          <button class="todo__remove" data-todo-id=${
            todo.id
          }><i class="far fa-trash-alt"></i></button>
        
    </li>`;
  });

  // Update the innerHTML of the todo list
  todoList.innerHTML = result;

  // Clear the input field after adding the todo
  todoInput.value = "";

  const removeButtons = document.querySelectorAll(".todo__remove");
  removeButtons.forEach((btn) => btn.addEventListener("click", removeTodos));

  const checkButtons = document.querySelectorAll(".todo__check");
  checkButtons.forEach((btn) => btn.addEventListener("click", checkTodos));

  const editButtons = document.querySelectorAll(".todo__edit");
  editButtons.forEach((btn) => btn.addEventListener("click", editTodos));
}

function filterTodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      createTodos(todos.filter((t) => t.isCompleted));
      break;
    }
    case "uncompleted": {
      createTodos(todos.filter((t) => !t.isCompleted));
      break;
    }
    default:
      createTodos(todos);
  }
}

function removeTodos(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((todo) => todo.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
}

function checkTodos(e) {
  const todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((todo) => todo.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

function editTodos(e) {
  backdrop.classList.remove("hidden");
  modal.classList.remove("hidden");

  const todos = getAllTodos();
  const editTodoId = Number(e.target.dataset.todoId);
  const todo = todos.find((todo) => todo.id === editTodoId);
  editTodoInput.value = todo.title;

  modal.addEventListener("submit", (e) => {
    e.preventDefault();

    todo.title = editTodoInput.value;

    saveAllTodos(todos);

    backdrop.classList.add("hidden");
    modal.classList.add("hidden");
    
    filterTodos();
  });
}

//* localstorage
function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}

function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}

function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
