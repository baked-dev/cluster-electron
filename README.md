# cluster-electron

alright quick readme since ive added a lot of stuff

## main file and electron process
the main file should look something like this:
```javascript
const { Interface, isMaster } = require('./index.js');

if (isMaster) {
  //this will be the electron main process now
  const { app, BrowserWindow, ipcMain } = require('electron');
  let UIWindow = null;
  app.on('ready', () => {
    UIWindow = new BrowserWindow();
  })
  ipcMain.on('message', (e, data) => {});
}
```
## Interface API
```javascript
const { Interface } = require('./index');
```
the interface extends the event emitter class so you can use the .on() function

### init_workers()
starts one worker per cpu core, needs to be called before any tasks can be added!

### new_worker()
adds an additional worker for whatever reason
### add_task(data)
adds task to the worker with data, needs to have an unique id
```javascript
const task = {
  id:0,       
  //this is the only required key by the interface, others are for the example task
  pid: '1234',
  size: 10,
  region: 'US'
};
Interface.add_task(task);
```

### edit_task(data)
edits task in workersmap and send edit task command to the worker that holds the task
data needs the id of the task, the interface merges the old data object with the one 
you provide, so if you only send the id and one key to add or update it doesnt change
the other values at all
```javascript
const edit = {
  id:0,
  pid: '1233'
};
Interface.edit_task(edit);
```

### start_task(taskID)
sends start message to wroker that holds the task

### start_all(opt:force)
starts all tasks that are not running already, if nothing or false is passed it has a 
cooldown of 2 seconds to allow the tasks to update their status, if you pass anything
equal (==) to true it ignores that cooldown

## Other stuff
### cluster-worker death
if a cluster worker fails it automatically starts a new one and re-distributes all of 
the died workers tasks

### method-chaining
all Interface methods return the Interface instace so you can chain methods like you
wish
```javascript
const { Interface } = require('./index');
const task = {
  id:0,       
  //this is the only required key by the interface, others are for the example task
  pid: '1234',
  size: 10,
  region: 'US'
};
const edit = {
  id:0,
  pid: '1233'
};
Interface
  .init_workers()
  .add_task(task)
  .edit_task(edit)
  .start_all()
  .on('update_task', console.log);
```