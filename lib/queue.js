import Logger from './Logger.js';

/**
 * Queue class to manage a list of tasks with error handling.
 */
class Queue {
    /**
     * Creates an instance of Queue.
     * @param {string} name - The name of the queue.
     * @param {boolean} [debug=false] - Flag to enable or disable debug logging.
     */
    constructor(name, debug = false) {
        this.name = name; // Name of the queue
        this.tasks = new Map(); // Map to hold tasks with task ID as key
        this.results = new Map(); // Map to store results of completed tasks
        this.debug = debug; // Debug flag for logging
        if (this.debug) Logger.info("Queue", `Initialized: ${name}`); // Log initialization if debug is enabled
        this.hasStarted = false;
    }

    /**
     * Adds a task to the queue.
     * @param {string} name - The task name.
     * @param {function} task - The task function to be executed.
     */
    async add(name, task) {
        try {
            if (typeof task !== "function") {
                throw new Error("Task must be a function!");
            }

            const id = await this.#generateId(); // Generate a unique ID for the task
            this.tasks.set(id, { name, task, id }); // Store task in the map with id as key
            if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `Task added: ${name} with ID: ${id}`); // Log task addition
        } catch (error) {
            Logger.error(`[Queue - ${this.name}]`, `Error adding task: ${error.message}`, error);
        }
    }

    /**
     * Starts processing the tasks in the queue.
     */
    async start() {
        
        try {
            if (this.hasStarted) {
                return;
            };

            this.hasStarted = true;

            if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `Starting queue`);

            if (this.tasks.size === 0) {
                if (this.debug) Logger.warn(`[Queue - ${this.name}]`, "No tasks to process.");
                return;
            }

            for (const [id, task] of this.tasks) {
                if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `Processing: ${task.name} with ID: ${task.id}`);

                try {
                    await this.#execute(task, id);
                } catch (error) {
                    Logger.error(`[Queue - ${this.name}]`, `Error processing task: ${task.name} with ID: ${task.id}. ${error.message}`);
                }
            };

            this.hasStarted = false;
        } catch (error) {
            Logger.error(`[Queue - ${this.name}]`, `Error starting queue: ${error.message}`, error);
            this.hasStarted = false;
        }
    }

    /**
     * Generates a unique ID for a task.
     * @returns {Promise<string>} A promise that resolves to a unique task ID.
     * @private
     */
    async #generateId() {
        try {
            return Math.random().toString(36).substring(2, 10); // Generate a random string as ID
        } catch (error) {
            Logger.error(`[Queue - ${this.name}]`, `Error generating task ID: ${error.message}`);
            throw error;
        }
    }

    /**
     * Executes a task and stores its result.
     * @param {Object} task - The task object containing name and id.
     * @param {string} id - The ID of the task.
     * @private
     */
    async #execute(task, id) {
        try {
            if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `>>> ${task.name} - Executing`); // Log task execution

            // Actually execute the task function and store the result
            const result = await task.task(); // Task is a function, so we call task() to get the result

            this.results.set(task.name, result); // Store the result
            this.tasks.delete(id); // Remove the task from the map

            if (this.debug) {
                Logger.debug(`[Queue - ${this.name}]`, `Completed: ${task.name} with result:`, result); // Log task completion
            }
        } catch (error) {
            Logger.error(`[Queue - ${this.name}]`, `Error executing task: ${task.name} with ID: ${task.id}. ${error.message}`, error);
        }
    }

    /**
     * Retrieves the result of a task.
     * @param {string} name - The name of the task.
     * @returns {Promise<any | undefined>} The task result.
     */
    async getResult(name) {
        const startTime = Date.now();
        if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `>>> ${name} - Getting result...`); // Log task result retrieval

        while (!this.results.has(name)) {
            if (Date.now() - startTime > 30000) { // 30s timeout
                if (this.debug) Logger.warn(`[Queue - ${this.name}]`, `>>> ${name} - Timed out while waiting for result.`);
                return undefined; // Timed out
            }
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        const data = this.results.get(name);
        if (
            data || // data is truthy (not null, undefined, false, NaN)
            data === 0 || // explicitly check for 0 (valid result)
            data === "" || // explicitly check for an empty string
            (Array.isArray(data) && data.length === 0) || // allow empty array
            (typeof data === 'object' && data !== null && Object.keys(data).length === 0) // allow empty object
        ) {
            this.results.delete(name); // Clear result if valid
            return data; // return data (including empty arrays/objects)
        } else {
            Logger.error(`Queue - ${this.name}`, `Task result for ${name} does not exist.`);
            return undefined; // Return undefined if data is completely missing or falsy
        }
    }
}

export default Queue;
