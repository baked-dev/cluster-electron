const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Emitter = require('events');

class Logger {
    log (string, processID = process.pid) {
        console.log(`${new Date().toISOString()} | ${processID} | ${string}`)
    }
}
const logger = new Logger;

//custom emitter to wrap the emit stuff into functions
class CustomInterface extends Emitter {
    constructor () {
        super();
    }
    add_task (data) {
        //cluster management only happens in the master process
        if (cluster.isMaster) {
            logger.log('adding task', 'MASTER')
            //find worker that has the least amout of tasks
            let lowest_key = get_best_worker();
            //send task start message to worker
            worker_message(lowest_key, {action:'new_task', payload: data});
            workersmap[lowest_key].tasks_amount++;
            workersmap[lowest_key].tasks.push(data);
        }
        //return this easy method chaning
        return this;
    }
    edit_task (data) {
        if (cluster.isMaster) {
            //find out which worker handles the task
            const workerID = find_task(data.id);
            if (workerID !== false) {
                worker_message(workerID, {action:'update_task', payload: data});
            }
        }
        return this;
    }
    start_task (taskID) {
        if (cluster.isMaster) {
            const workerID = find_task(taskID);
            if (workerID !== false) {
                worker_message(workerID, {action:'start_task', payload: taskID});
            }
        }
        return this;
    }
    new_worker () {
        if (cluster.isMaster) {
            new_worker();
        }
        return this;
    }
}

const worker_message = send_message_to_worker = (worker, message) => {
    workersmap[worker].worker.send(message);
}

const get_best_worker = find_worker_with_lowest_tasks_amount = () => {
    let lowest_val = false;
    let lowest_key = false;
    for (let key of Object.keys(workersmap)) {
        if (lowest_val === false || workersmap[key].tasks_amount < lowest_val) {
            lowest_val = workersmap[key].tasks_amount;
            lowest_key = key;
        }
    }
    return lowest_key;
}

const find_task = get_worker_id_that_handles_task = (taskID) => {
    for (let key of Object.keys(workersmap)) {
        if (workersmap[key].tasks.map(e => e.id).includes(taskID)) return key;
    }
    return null;
}

const new_worker = register_new_worker_and_event_listeners = () => {
    const id = workersID++;
    workersmap[id] = {
        worker: cluster.fork(),
        tasks_amount: 0,
        tasks: [],
    };
    workersmap[id].worker.on('message', (message) => {
        if (message.action === 'started_task') {
            logger.log(`worker ${id} started task, ${Object.keys(workersmap).map(e => workersmap[e].tasks_amount).join()}`, 'MASTER')
        } else if (message.action === 'update_task') {
            Interface.emit('update_task', {worker:id, data: message.payload});
        }
    });
}
//global reference to the Interface that will be exported
let workersmap = {},
    workersID = 0,
    Interface = new CustomInterface();  

if (cluster.isMaster) {
    logger.log('Master running', 'MASTER');
    //start workers
    for (let core = 0; core < numCPUs; core++) {
        new_worker();
    }
} else {
    logger.log('Worker running and waiting for tasks');
    const ExampleTask = require('./ExampleTask');

    const new_task = register_new_task = (data) => {
        taskmap[data.payload.id] = new ExampleTask(data.payload);
    }

    let taskmap = {};
    process.send({type:'ready'});
    process.on('message', (data) => {
        if (data.action === 'new_task') {
            logger.log('new task: ' + JSON.stringify(data.payload));
            new_task(data);
        } else if (data.action === 'start_task') {
            taskmap[data.payload].start();
        }
    })
}
module.exports = Interface;

