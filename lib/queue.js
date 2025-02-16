import Logger from './logger.js';

class Queue {
    constructor(name, debug = false) {
        this.name = name || "MyQueue";
        this.tasks = new Map();
        this.results = new Map();
        this.debug = debug;
        this.started = false;
        if (this.debug) Logger.debug(`Queue - ${this.name}`, `Initialised queue with name: ${this.name} (debug ${this.debug ? "enabled" : "disabled"})`);
    }

    async add(name, task) {
        try {
            if (typeof task !== "function") {
                throw new Error("Task must be a function!");
            }

            const id = await this.#generateId();
            this.tasks.set(id, { name, task, id });
            if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `Task added: ${name} with ID: ${id}`);
            this.#startProcess();
        } catch (error) {
            Logger.error(`Queue - ${this.name}`, `Error adding task: ${error.message}`, error);
        }
    }

    async start() {
        process.emitWarning(
            "[@kyvrixon/async-queue] The .start() method is deprecated and has no effect. Will be removed in the next major version.",
            'DeprecationWarning'
        );
        return;
    }

    async #startProcess() {

        if (this.tasks.size === 0) {
            return;
        };

        if (this.started) {
            return;
        }

        this.started = true;

        for (const [id, task] of this.tasks) {
            try {
                await this.#execute(task, id);
            } catch (error) {
                Logger.error(`Queue - ${this.name}`, `Error processing task: ${task.name} with ID: ${task.id}. ${error.message}`, error);
            }
            this.tasks.delete(id);
        }

        this.started = false;
    }

    async #generateId() {
        try {
            return Math.random().toString(36).substring(2, 10);
        } catch (error) {
            Logger.error(`[Queue - ${this.name}]`, `Error generating task ID: ${error.message}`);
            throw error;
        }
    }

    async #execute(task, id) {
        try {
            if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `>>> ${task.name} - Executing`);

            const result = await task.task();
            this.results.set(task.name, result);
            this.tasks.delete(id);

            if (this.debug) {
                Logger.debug(`[Queue - ${this.name}]`, `Completed: ${task.name} with result:`, result);
            }
        } catch (error) {
            Logger.error(`[Queue - ${this.name}]`, `Error executing task: ${task.name} with ID: ${task.id}. ${error.message}`, error);
        }
    }

    async getResult(name) {
        const startTime = Date.now();
        if (this.debug) Logger.debug(`[Queue - ${this.name}]`, `>>> ${name} - Getting result...`);

        while (!this.results.has(name)) {
            if (Date.now() - startTime > 30000) {
                if (this.debug) Logger.warn(`[Queue - ${this.name}]`, `>>> ${name} - Timed out while waiting for result.`);
                return undefined;
            }
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        const data = this.results.get(name);
        if (data || data === 0 || data === "" || (Array.isArray(data) && data.length === 0) || (typeof data === 'object' && data !== null && Object.keys(data).length === 0)) {
            this.results.delete(name);
            return data;
        } else {
            Logger.error(`Queue - ${this.name}`, `Task result for ${name} does not exist.`);
            return undefined;
        }
    }
}

export default Queue;

