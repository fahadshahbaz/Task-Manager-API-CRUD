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

// First endpoint - POST (Create)
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

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
