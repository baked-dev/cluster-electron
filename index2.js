const cluster = require('./index');
let tasksid = 0
cluster
    .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
    .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
    .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
    .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
    .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
    .add_task({id:tasksid++, pid: "AC7033", size: 10, region: 'US'})
    .on('update_task', console.log)
const start_all = () => {
    for (let i = 0; i < tasksid; i++) {
        cluster.start_task(i);
    }
}
setTimeout(start_all, 1000);
