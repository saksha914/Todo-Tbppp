const Todo = require('../models/todoModels.js');

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    
    // Format the response to match frontend structure
    const formattedTodos = {
      recentTasks: todos.map(todo => ({
        id: todo._id,
        title: todo.title,
        completed: todo.completed,
        date: todo.date,
        priority: todo.priority
      }))
    };
    
    res.status(200).json(formattedTodos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching todos', error });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title, date, priority } = req.body;
    
    // Validate required fields
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const newTodo = await Todo.create({
      title,
      date,
      priority: priority || 'medium',
      completed: false
    });

    res.status(201).json({
      id: newTodo._id,
      title: newTodo.title,
      completed: newTodo.completed,
      date: newTodo.date,
      priority: newTodo.priority
    });
  } catch (error) {
    res.status(400).json({ message: 'Error creating todo', error });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title, date, priority } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { completed, title, date, priority },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.status(200).json({
      id: updatedTodo._id,
      title: updatedTodo.title,
      completed: updatedTodo.completed,
      date: updatedTodo.date,
      priority: updatedTodo.priority
    });
  } catch (error) {
    res.status(400).json({ message: 'Error updating todo', error });
  }
};

const toggleTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.status(200).json({
      id: todo._id,
      title: todo.title,
      completed: todo.completed,
      date: todo.date,
      priority: todo.priority
    });
  } catch (error) {
    res.status(400).json({ message: 'Error toggling todo status', error });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.status(200).json({ message: 'Todo deleted successfully', id });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting todo', error });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoStatus,
  deleteTodo,
};
