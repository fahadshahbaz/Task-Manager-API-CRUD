import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

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

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API - TS Edition",
      version: "1.0.0",
      description: "A simple CRUD API for managing tasks built with TypeScript"
    },
    servers: [{ url: "http://localhost:3000" }]
  },
  apis: [process.cwd() + "/index.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - completed
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         completed:
 *           type: boolean
 *           description: The completion status of the task
 *       example:
 *         id: d5fE_asz
 *         title: Learn Swagger
 *         completed: false
 */

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *       400:
 *         description: Invalid input
 */
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, completed } = req.body;

  if (typeof title !== "string" || typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid input. 'title' must be a string and 'completed' be a boolean."
    })
  }

  const newTask: Task = {
    id: uuidv4(),
    title,
    completed
  };

  tasks.push(newTask);
  res.status(201).json({
    success: true,
    data: newTask,
    message: "Task created successfully"
  });
})

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Returns the list of all the tasks
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tasks by title
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
app.get("/api/tasks", (req: Request, res: Response) => {
  let result = tasks;
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

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 */
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

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update the task by the id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was updated
 *       404:
 *         description: The task was not found
 *       400:
 *         description: Invalid input
 */
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const { title, completed } = req.body;
  const task = tasks.find((t) => t.id === req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  if (typeof title !== "string" || typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Invalid Input"
    });
  }

  task.title = title;
  task.completed = completed;

  res.json({
    success: true,
    message: "Task updated successfully"
  });
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       200:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 */
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  tasks.splice(index, 1);
  res.json({
    success: true,
    message: "Task deleted successfully"
  });
})

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get statistics of tasks
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: General statistics about tasks
 */
app.get("/api/stats", (req: Request, res: Response) => {
  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = total - completedCount;

  res.json({
    success: true,
    data: {
      total,
      completed: completedCount,
      pending: pendingCount
    },
    message: "Task stats fetched successfully",
  });
});

app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    data: null,
    message: "Internal Server Error - Something went wrong on our side!"
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send(`
    <div style="font-family: sans-serif; max-width: 600px; margin: 100px auto; text-align: center;">
      <h1>Linux is better 🐧</h1>
      <p>A TypeScript-powered Task Manager API featuring complete CRUD operations, real-time search/filtering, and instant task statistics.</p>
      <br />
      <a href="/api-docs">Access Swagger Docs</a>
    </div>
  `);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;

