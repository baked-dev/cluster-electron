const { Interface, isMaster } = require('./index');


console.log(isMaster);

if (isMaster) {
    const { BrowserWindow, app } = require('electron');
    let tasksid = 0;
    app.on('ready', () => {
        const Window = new BrowserWindow();
        Interface
            .init_workers()
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .new_worker()
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
            .edit_task({id:9, pid: "AC7033", size: 9, region: 'US'})
            .on('update_task', console.log);
        const start_all = () => {
            for (let i = 0; i < tasksid; i++) {
                Interface.start_task(i);
            }
        }
        setTimeout(start_all, 1000);
    })
}

