const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

class Logger {
    log (string, processID = process.pid) {
        console.log(`${new Date().toISOString()} | ${processID} | ${string}`)
    }
}
const logger = new Logger;

//custom emitter to wrap the emit stuff into functions
  

if (cluster.isMaster) {
    const Emitter = require('events');
    class CustomInterface extends Emitter {
        constructor () {
            super();
            this.last_start_all = 0;
        }
        add_task (data) {
            logger.log('adding task', 'MASTER')
            //find worker that has the least amout of tasks
            let lowest_key = get_best_worker();
            //send task start message to worker
            worker_message(lowest_key, {action:'new_task', payload: data});
            workersmap[lowest_key].tasks_amount++;
            workersmap[lowest_key].tasks.push(data);
            //return this easy method chaning
            return this;
        }
        edit_task (data) {
            //find out which worker handles the task
            const workerID = find_task(data.id);
            if (workerID !== false) {
                worker_message(workerID, {action:'edit_task', payload: edit_task(workerID, data)});
            }
            return this;
        }
        start_task (taskID) {
            const workerID = find_task(taskID);
            if (workerID !== false) {
                worker_message(workerID, {action:'start_task', payload: taskID});
            }
            return this;
        }
        start_all (force = false) {
            if (new Date().getTime() - this.last_start_all < 2000 || force) {
                logger.log('cooldown on start all', 'MASTER');
            } else {
                //holy shit i made this and it worked first try
                Object.keys(workersmap).map(e => workersmap[e].tasks.map(f => (!f.running?f.id:false))).map(e => e.map(f => f!==false?this.start_task(f):false));
                this.start_all = new Date().getTime();
            }
            return this;
        }
        new_worker () {
            new_worker();
            return this;
        }
        init_workers () {
            init_workers()
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
            pid: null,
        };
        workersmap[id].worker.on('message', ({ action, payload }) => {
            if (action === 'update_task') {
                Interface.emit('update_task', {worker:id, data: payload});
                //imtercept message to set that task to running
                const { status } = payload;                                         //cant destructure id because that would interfere with the workersID in this context
                if (status === 'started' || status === 'stopped') {
                    edit_task(id, {id:payload.id, running: (status === 'started'?true:false)});
                }
            } else if (action === 'ready') {
                workersmap[id].pid = payload;
            }
        });
        return id;
    }

    const init_workers = initialise_one_worker_per_cpu_code = () => {
        for (let core = 0; core < numCPUs; core++) {
            new_worker();
        }
    }

    const restart_worker = restart_worker_after_death_by_pid = (worker) => {
        //find workersID
        for (const key of Object.keys(workersmap)) {
            if (workersmap[key].pid === worker.pid) {
                const { tasks } = workersmap[key];
                //start new worker
                new_worker();
                //re-distribute dead tasks
                for (const task of tasks) {
                    Interface.add_task(task);
                }
                break;
            }
        }
    }

    const edit_task = edit_task_in_workersmap = (workerID, data) => {
        //find task index in array
        for (let i in workersmap[workerID].tasks) {
            if (workersmap[workerID].tasks[i].id === data.id) {
                //merge objects instead of completely overwriting, allows editing by just sending {id:taskID, running:true} for example
                workersmap[workerID].tasks[i] = Object.assign(workersmap[workerID].tasks[i], data);
                return workersmap[workerID].tasks[i]
            }
        }
    }

    const randInt = random_integer = (min, max) => {
        return Math.floor(Math.random()*(max - min)) + min;
    }

    //global reference to the Interface that will be exported
    let workersmap = {},
        workersID = 0,
        Interface = new CustomInterface();
    logger.log('Master running', 'MASTER');
    cluster.on('death', restart_worker);
    module.exports = {
        Interface,
        isMaster: cluster.isMaster
    };
} else {
    logger.log('Worker running and waiting for tasks');
    const ExampleTask = require('./ExampleTask');

    const new_task = register_new_task = (data) => {
        taskmap[data.payload.id] = new ExampleTask(data.payload);
    }
    let taskmap = {};
    process.send({action:'ready', payload: process.pid});
    process.on('message', (data) => {
        if (data.action === 'new_task') {
            logger.log('new task: ' + JSON.stringify(data.payload));
            new_task(data);
        } else if (data.action === 'start_task') {
            taskmap[data.payload].start();
        } else if (data.action === 'edit_task') {
            logger.log('edit task: ' + JSON.stringify(data.payload));
        }
    })
    module.exports = {
        Interface: false,
        isMaster: cluster.isMaster
    };
}
//made this for jm yesterday



