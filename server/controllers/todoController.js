const Todo = require('../models/todoModels.js');

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = await Todo.create({ title, description });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo', error });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo', error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting todo', error });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
