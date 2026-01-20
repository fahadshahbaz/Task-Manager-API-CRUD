import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// In memory data
let tasks: Task[] = [];

const app = express();
app.use(express.json());
const port = 3000;

// First endpoint - POST (Create Task)
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, completed } = req.body;

  // first validate the data, if user sent the right data
  if (typeof title !== "string" || typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid input. 'title' must be a string and 'completed' be a boolean."
    })
  }
  // create the task object - while you were typing noticed how TS was yelling about missing title and completed :)
  const newTask: Task = {
    id: uuidv4(),
    title,
    completed
  };

  // save it to array and send success response
  tasks.push(newTask);
  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully"
  });
})

// Second endpoint - GET (Get all the Tasks)
app.get("/api/tasks", (req: Request, res: Response) => {
  let result = tasks;
  // Check if there is title query
  if (req.query.title) {
    const search = (req.query.title as string).toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(search));
  }
  res.json({
    success: true,
    count: result.length,
    data: result,
    message: "Tasks fetched successfully"
  });
});

// Third endpoint - GET/:id (Get single task with id)
app.get("/api/tasks/:id", (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task)
    return res
      .status(404)
      .json({
        success: false,
        data: null,
        message: "Task not found"
      });
  res.json({
    success: true,
    data: task,
    message: "Task fetched successfully"
  })
})

// Fourth endpoint - PUT (update Task)
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const { title, completed } = req.body;

  // find the task using id
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  // validation
  if (typeof title !== "string" || typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      messgae: "Invalid Input"
    });
  }

  // update the task now
  task.title = title;
  task.completed = completed;

  res.json({
    success: true,
    messgae: "Task update successfully"
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
