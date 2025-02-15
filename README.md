> [!TIP]
> This project is actively maintained and all input is welcome! Just fork the repo and create a PR with your changes. All changes must be fully tested before committing!

> [!WARNING]
> Do expect bugs! If you spot anything abnormal, please create a new issue describing your problem!

# Async Queue

This is a simple and flexible queue manager for managing tasks in a queue with error handling. It allows you to add, process, and retrieve the results of tasks, making it easier to manage asynchronous operations in a sequential manner. You can also enable debug logging to track the queue's activity.

The package is ideal for handling a series of tasks that need to be processed one by one, providing easy error management and clear task execution flow.

## Features

- **Task management**: Add tasks to the queue, process them, and retrieve results.
- **Error handling**: Automatically logs errors when a task fails.
- **Debug logging**: Optionally enable debug logs for better visibility into queue operations.
- **Asynchronous execution**: All tasks are executed asynchronously.
- **Flexible result retrieval**: Get results of tasks once they have completed.

## Installation

You can install via your package manager:

```bash
# npm as an example
npm install @kyvrixon/async-queue
```

## Usage

### 1. **Creating an Instance of the Queue**

To create a new instance of the queue, use the constructor and pass a name and optionally a debug boolean flaf to enable debug logs in your console. Handy for figuring out problems.

```javascript
import Queue from "@kyvrixon/queue";

// Create a queue with debugging enabled
const queue = new Queue("MyQueue", true);
```

### 2. **Adding a Task to the Queue**

You can add a task to the queue by passing a name and a function to execute. The function must return a result asynchronously (e.g., a promise):

```javascript
const myTask = async () => {
  return "Task Result";
};

await queue.add("MyTask", myTask); // Adds the task to the queue
```

### 3. **Starting the Queue**

Once tasks are added to the queue, you can start processing them using the `start` method. This method will execute the tasks sequentially. The queue will continue until all tasks in the queue is complete. Its good measure to call this after adding your tasks.

```javascript
await queue.start(); // Starts processing the queue
```

### 4. **Getting the Result of a Task**

After a task is completed, you can retrieve the result using the `getResult` method. This method waits for the task to finish and returns the result:

```javascript
const result = await queue.getResult("MyTask"); // Retrieves the result of "MyTask"
console.log(result); // Logs the result of the task
```

### Full Example

Here's a full example showing how to use this.

```javascript
import Queue from "@kyvrixon/queue";

// Create a queue with debugging enabled
const queue = new Queue("ExampleQueue", true);

// Define two tasks
const task1 = async () => {
  console.log("Task 1 is running...");
  return "Task 1 completed";
};

const task2 = async () => {
  console.log("Task 2 is running...");
  return "Task 2 completed";
};

// Add tasks to the queue
await queue.add("Task 1", task1);
await queue.add("Task 2", task2);

// Start processing the queue
await queue.start();

// Retrieve and log results for each task
const result1 = await queue.getResult("Task 1");
console.log("Result of Task 1:", result1);

const result2 = await queue.getResult("Task 2");
console.log("Result of Task 2:", result2);
```

### Output Example

```plaintext
Task 1 is running...
Task 2 is running...
Result of Task 1: Task 1 completed
Result of Task 2: Task 2 completed
```

## Methods explained

### `Queue(name: string, debug?: boolean)`

Creates a new queue instance.

- **name**: The name of the queue.
- **debug** (optional): Enable or disable debug logging (default is `false`).

### `add(name: string, task: Function): Promise<void>`

Adds a task to the queue.

- **name**: The name of the task.
- **task**: An async function representing the task.

#### Example:
```javascript
await queue.add("MyTask", myTask);
```

### `start(): Promise<void>`

Starts processing the tasks in the queue sequentially.

#### Example:
```javascript
await queue.start();
```

### `getResult(name: string): Promise<any | undefined>`

Gets the result of a completed task by its name. If the task hasn't completed yet, it waits until the result is available (with a 30-second timeout).

- **name**: The name of the task.

#### Example:
```javascript
const result = await queue.getResult("MyTask");
console.log(result);
```

## Debugging

You can enable debug logging when creating the queue instance by passing `true` as the second argument:

```javascript
const queue = new Queue("MyQueue", true); // Enables debug logging
```

Debug logs will provide visibility into the queue's operations, including when tasks are added, processed, and completed.