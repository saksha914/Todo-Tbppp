// Sample in-memory data for todos
let todos = [];

// Get all todos
const getTodos = (req, res) => {
  res.status(200).json(todos);
};

// Create a new todo
const createTodo = (req, res) => {
  const { title, description } = req.body;
  const newTodo = {
    id: todos.length + 1,
    title,
    description,
    completed: false,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// Update a todo by ID
const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  const todo = todos.find((t) => t.id === parseInt(id));

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todo.title = title || todo.title;
  todo.description = description || todo.description;
  todo.completed = completed !== undefined ? completed : todo.completed;

  res.status(200).json(todo);
};

// Delete a todo by ID
const deleteTodo = (req, res) => {
  const { id } = req.params;
  todos = todos.filter((t) => t.id !== parseInt(id));
  res.status(200).json({ message: 'Todo deleted successfully' });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
