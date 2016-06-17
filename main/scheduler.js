const confs = require('./config');

module.exports = {

	run: function(){
        const monitors = this.loadMonitors();
        const tasks = this.loadTasks();

        tasks = tasks instanceof Array ? tasks : [tasks];
        var date = new Date();
        tasks.forEach(function(tsk){ // each task (with multiple devices)
            tsk.runId = date.getTime();
            if(monitors[tsk.module]){ // verify if monitor is installed
                monitors[tsk.module](tsk, function(err, results){ // run the task with respective module
                    //console.log(results);
                    var statusLog = { taskId:tsk.taskId, runId:tsk.runId, tdiff:0, results:results };
                    console.log(statusLog);
                    //this.emitStatus(statusLog);
                });
            } else console.log("module not installed: "+ tsk.module);
        });

    },

    emitStatus: function(statusLog){
        console.log(statusLog);
    },

	loadTasks: function(){
        console.log('> loading tasks');
        const tasks = require(confs.tasksFile).tasks;
        return tasks;
	},

	loadMonitors: function(){
        console.log('> loading monitors');
        const monitors = require(confs.monitorsDir);
        return monitors;
    }

}
