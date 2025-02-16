import Queue from "../lib/queue.js";

// Track the start time for logging purposes
const start = Date.now();

(async () => {
    // Create a new Queue instance with debug mode enabled
    const queue = new Queue('My awesome queue', true);

    // Add Task 1 to the queue
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Adding Task 1`);
    await queue.add("Task 1", async () => {
        // Simulate task execution
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 1 - Executing`);
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 1 - done`);
        return 42; // Return a result
    });

    // Add Task 2 to the queue
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Adding Task 2`);
    await queue.add("Task 2", async () => {
        // Simulate task execution
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 2 - Executing`);
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 2 - done`);
        return { foo: "bar" }; // Return a result
    });

    // Add Task 3 to the queue
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Adding Task 3`);
    await queue.add("Task 3", async () => {
        // Simulate task execution
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 3 - Executing`);
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 3 - done`);
        return "Hello World!"; // Return a result
    });

    // Start the queue processing (Deprecated but included for demonstration)
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Starting the queue`);
    await queue.start();

    // Retrieve and log results of each task
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Retrieving results`);
    const result1 = await queue.getResult("Task 1");
    const result2 = await queue.getResult("Task 2");
    const result3 = await queue.getResult("Task 3");

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> result 1: `, result1);
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> result 2: `, result2);
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> result 3: `, result3);
    
    // Exit the process
    process.exit(0);
})();

