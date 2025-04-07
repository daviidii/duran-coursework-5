import DuranTodoModel from "../models/duranModel.js";

// Create new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ error: "Title must be provided" });
    }

    // create the task
    const task = await DuranTodoModel.create({
      title,
      userId,
      description,
      status: status || "Pending",
      due_date,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("error >>>", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await DuranTodoModel.findAll({
      order: [["createdAt", "ASC"]],
      where: { userId },
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("error >>>", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single task by ID
export const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    const task = await DuranTodoModel.findOne({
      where: { _id: taskId, userId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found or doesn't exist" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("error >>>", error);
    res.status(500).json({ error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;
    const { title, description, status, due_date } = req.body;

    // update task only owned by user
    const [affectedTask] = await DuranTodoModel.update(
      {
        title,
        description,
        status,
        due_date,
      },
      { where: { _id: taskId, userId } }
    );

    if (affectedTask === 0) {
      return res.status(404).json({ error: "Task not found or doesn't exist" });
    }

    const updatedTask = await DuranTodoModel.findByPk(taskId);

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("error >>>", error);
    res.status(500).json({ error: error.message });
  }
};

// delete a task
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user._id;
    const taskId = req.params.id;

    // find task
    const deletedTasks = await DuranTodoModel.destroy({
      where: { _id: taskId, userId },
    });
    if (deletedTasks === 0) {
      return res.status(404).json({ error: "Task not found or doesn't exist" });
    }

    res.status(204).json({ message: "task deleted successfully" });
  } catch (error) {
    console.error("error >>>", error);
    res.status(500).json({ error: error.message });
  }
};
