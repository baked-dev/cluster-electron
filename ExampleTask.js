const Emitter = require('events');

class ExampleTask {
    constructor ({ id, pid, size, region }) { 
        this.id = id;
        this.pid = pid;
        this.size = size;
        this.region = region;
        //this.jar = request.jar();
    }
    start () {
        this.send_start();
        setTimeout(this.send_stop.bind(this), 5000);
    }
    send_start () {
        process.send({action:'update_task', payload: {id: this.id, status:'started'}});
    }
    send_stop () {
        process.send({action:'update_task', payload: {id: this.id, status:'stopped'}});
    }
}

module.exports = ExampleTask;