const Task = require('../models/Task');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    console.log('All tasks:', tasks); // Debugging log
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    console.log('Received data:', { title, description }); // Debugging log
    
    // Validation
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title: title, // පැහැදිලිව title assign කරන්න
      description: description || '' // description නැත්නම් empty string
    });

    console.log('Task before save:', task); // Debugging log

    const savedTask = await task.save();
    
    console.log('Saved task:', savedTask); // Debugging log
    
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET

// @desc    Update task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    
    console.log('Update request:', { id: req.params.id, body: req.body }); // Debug log
    
    // Find task by id
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update fields (only if provided)
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    
    console.log('Updated task:', updatedTask); // Debug log
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
};

const deleteTask = async (req, res) =>{
    try{
        const task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({
                message : 'Task not found..😢'
            })
        }
        await task.deleteOne();
        res.json({
            message : 'Task removed successfully..🥰'
        })
    }catch(error){
        res.status(500).json({
            message : 'Failed to remove task..😢'
        })
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};