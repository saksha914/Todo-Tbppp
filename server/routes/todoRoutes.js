const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

router.get('/get-todos', getTodos);          // Get all todos
router.post('/post-todo', createTodo);       // Create a new todo
router.put('/update-todo/:id', updateTodo);  // Update a todo by ID
router.delete('/delete-todo/:id', deleteTodo); // Delete a todo by ID

module.exports = router;
