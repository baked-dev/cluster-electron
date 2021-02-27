const { Interface, isMaster, TaskTypes } = require('../index');
const task = require('./ExampleTask');

// check if this is the master process
if (isMaster) {
    const { BrowserWindow, app } = require('electron');
    let tasksid = 0;
    app.on('ready', () => {
        const Window = new BrowserWindow();
        Interface
            .init_workers()
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', type: 'test'})
            /* .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .new_worker()
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            .edit_task({id:9, size: 9}) */
            .start_all()
            .on('update_task', console.log);
        /* setTimeout(() => {
            Interface.add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US', task})
            Interface.start_task(tasksid - 1);
        }, 10000); */
        
    })
} else {
    TaskTypes.test = task;
}

