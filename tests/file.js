import Queue from "../lib/queue.js";

const start = Date.now();

(async () => {
    const queue = new Queue('TESTS', true);

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Adding Task 1`);
    await queue.add("Task 1", async () => {
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 1 - Executing`);
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 1 - done`);
        return 42;
    });

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Adding Task 2`);
    await queue.add("Task 2", async () => {
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 2 - Executing`);
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 2 - done`);
        return { foo: "bar" };
    });

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Adding Task 3`);
    await queue.add("Task 3", async () => {
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 3 - Executing`);
        console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> task 3 - done`);
        return "Hello World!";
    });

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Starting the queue`);
    await queue.start();

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] [Queue] Retrieving results`);
    const result1 = await queue.getResult("Task 1");
    const result2 = await queue.getResult("Task 2");
    const result3 = await queue.getResult("Task 3");

    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> result 1: `, result1);
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> result 2: `, result2);
    console.log(`[${(Date.now() - start).toString().padStart(5)}ms] >>> result 3: `, result3);
})();

