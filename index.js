const fs = require('fs');
const yargs = require('yargs');

const tasksFile = 'tasks.json';

// Helper function to read tasks from the file
const readTasks = () => {
    try {
        const dataBuffer = fs.readFileSync(tasksFile);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        return []; 
    }
};

// Helper function to save tasks to the file
const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(tasksFile, dataJSON);
};

// Command to add a task
yargs.command({
    command: 'add',
    describe: 'Add a new task',
    builder: {
        description: {
            describe: 'Task description',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        const tasks = readTasks();
        const newTask = {
            id: tasks.length + 1,
            description: argv.description,
            completed: false
        };
        tasks.push(newTask);
        saveTasks(tasks);
        console.log(`Task "${argv.description}" added successfully!`);
    }
});

// Command to list all tasks
yargs.command({
    command: 'list',
    describe: 'List all tasks',
    handler() {
        const tasks = readTasks();
        if (tasks.length === 0) {
            console.log('No tasks available.');
            return;
        }
        console.log('Task List:');
        tasks.forEach((task) => {
            console.log(`${task.id}. ${task.description} - ${task.completed ? 'Completed' : 'Not Completed'}`);
        });
    }
});

// Command to mark a task as completed
yargs.command({
    command: 'complete',
    describe: 'Mark a task as completed',
    builder: {
        id: {
            describe: 'Task ID to mark as completed',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv) {
        const tasks = readTasks();
        const task = tasks.find((task) => task.id === argv.id);
        if (!task) {
            console.log('Task not found!');
            return;
        }
        task.completed = true;
        saveTasks(tasks);
        console.log(`Task ${argv.id} marked as completed!`);
    }
});

// Command to remove a task
yargs.command({
    command: 'remove',
    describe: 'Remove a task',
    builder: {
        id: {
            describe: 'Task ID to remove',
            demandOption: true,
            type: 'number'
        }
    },
    handler(argv) {
        const tasks = readTasks();
        const updatedTasks = tasks.filter((task) => task.id !== argv.id);
        if (updatedTasks.length === tasks.length) {
            console.log('Task not found!');
            return;
        }
        saveTasks(updatedTasks);
        console.log(`Task ${argv.id} removed successfully!`);
    }
});

// Parse command-line arguments
yargs.parse();