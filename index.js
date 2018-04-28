const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const Emitter = require('events');

class Logger {
    log (string, process) {
        console.log(`${new Date().toISOString()} | ${process} | ${string}`)
    }
}
const logger = new Logger;

//custom emitter to wrap the emit stuff into functions
class CustomInterface extends Emitter {
    constructor () {
        super();
    }
    start_task (data) {
        //cluster management only happens in the master process
        if (cluster.isMaster) {
            //find worker that has the least amout of tasks
            let lowest_val = false;
            let lowest_key = false;
            for (let key of Object.keys(workersmap)) {
                if (lowest_val === false || workersmap[key].tasks_amount < lowest_val) {
                    lowest_val = workersmap[key].tasks_amount;
                    lowest_key = key;
                }
            }
            //send task start message to worker
            worker_message(lowest_key, {action:'new_task', payload: data});
            workersmap[lowest_key].tasks_amount++;
        }
        //return this easy method chaning
        return this;
    }
}

const worker_message = send_message_to_worker = (worker, message) => {
    workersmap[worker].worker.send(message);
}

//global reference to the Interface that will be exported
let workersmap = {},
    workersID = 0,
    Interface = new CustomInterface();  

if (cluster.isMaster) {
    logger.log('Master running', process.pid);
    //start workers
    for (let core = 0; core<numCPUs; core++) {
        const id = workersID++;
        workersmap[id] = {
            worker: cluster.fork(),
            tasks_amount: 0,
            tasks: [],
        };
        workersmap[id].worker.on('message', (message) => {
            if (message.action === 'started_task') {
                logger.log(`worker ${id} started task, ${Object.keys(workersmap).map(e =>  workersmap[e].tasks_amount).join()}`, process.pid)
            }
        });
    }
} else {
    logger.log('Worker running and waiting for tasks', process.pid);
    process.on('message', (data) => {
        logger.log(`received message from master: ${JSON.stringify(data)}`, process.pid);
        process.send({action:'started_task'});
    })
}
module.exports = Interface;

