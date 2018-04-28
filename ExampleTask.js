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
        process.send({action:'update_task', payload: {id: this.id, status:'started'}});
    }
}

module.exports = ExampleTask;