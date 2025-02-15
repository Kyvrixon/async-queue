/// <reference types="node" />

declare module "@kyvrixon/async-queue" {
    /**
     * Queue class to manage a list of tasks with error handling.
     */
    class Queue {
        name: string;
        tasks: Map<string, { name: string; task: Function; id: string }>;
        results: Map<string, any>;
        debug: boolean;
        hasStarted: boolean;

        /**
         * Creates an instance of Queue.
         * @param {string} name - The name of the queue.
         * @param {boolean} [debug=false] - Flag to enable or disable debug logging.
         *
         * @example
         * const queue = new Queue("MyQueue", true); // Queue with debug logging enabled
         */
        constructor(
            name: string,
            debug?: boolean
        );

        /**
         * Adds a task to the queue.
         * @param {string} name - The task name.
         * @param {function} task - The task function to be executed.
         *
         * @example
         * const myTask = async () => { return "Task Result"; };
         * await queue.add("MyTask", myTask); // Adds a task to the queue
         */
        add(name: string, task: Function): Promise<void>;

        /**
         * Starts processing the tasks in the queue.
         *
         * @example
         * await queue.start(); // Starts processing tasks in the queue
         */
        start(): Promise<void>;

        /**
         * Retrieves the result of a task.
         * @param {string} name - The name of the task.
         * @returns {Promise<any | undefined>} The task result.
         *
         * @example
         * const result = await queue.getResult("MyTask");
         * console.log(result); // Logs the result of "MyTask"
         */
        getResult(name: string): Promise<any | undefined>;

        /**
         * Generates a unique ID for a task.
         * @returns {Promise<string>} A promise that resolves to a unique task ID.
         * @private
         */
        #generateId(): Promise<string>;

        /**
         * Executes a task and stores its result.
         * @param {Object} task - The task object containing name and id.
         * @param {string} id - The ID of the task.
         * @private
         */
        #execute(task: { name: string; task: Function; id: string }, id: string): Promise<void>;
    }

    export = Queue;
}
