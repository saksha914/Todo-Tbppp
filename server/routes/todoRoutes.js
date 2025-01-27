const express = require('express');
const {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

// Simplified routes without prefixes
router.get('/todos', getTodos);                    // Get all todos
router.post('/todos', createTodo);                 // Create a new todo
router.put('/todos/:id', updateTodo);              // Update a todo
router.patch('/todos/:id/toggle', toggleTodoStatus); // Toggle todo status
router.delete('/todos/:id', deleteTodo);           // Delete a todo

module.exports = router;
