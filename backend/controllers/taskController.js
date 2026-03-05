const Task = require('../models/Task');

const getTasks = async (req, res) =>{
    try{
        const tasks = await Task.find().sort({createdAt: -1});
        res.json(tasks);
    }catch(error){
        res.status(500).jason({
            message : 'Failed to fetch tasks..😢'
        })
    };
    
};

const createTask = async (req, res) => {
    try{
        const {title, description} = req.body;
        if(!title){
            return res.status(400).json({
                message : 'Title is required..🫠'
            })
        }
        const task = new Task({
            title,
            description
        })

        const savedTask = await task.save();
        res.status(201).json({
            message : 'Task created..🥰'
        })

    }catch(error){
        res.status(400).json({
            message : 'Failed to create task..😢'
        })
    }
}

const updateTask = async (req, res) =>{
    try{
        const {title, description, status } = req.body;

        let task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({
                message : 'Task not found..😢'
            })
        }
            task.title = title || task.title;
            task.description = description !== undefined ? description : task.description;
            task.status = status || task.status;

        const updatedTask = await task.save();
        res.json({
            message: 'Task Updated..🥰'
        })
    }catch(error){
        res.status(500).json({
            meessage : error + 'Failed to update task..😢'
        })
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