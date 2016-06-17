'use strict';
const confs = require('./config');
const schedule = require('node-schedule');


module.exports = {

    start: function(){ return schedule.scheduleJob(confs.runInterval, this.run()); },

    stop: function(){ this.start().cancel(); },

	run: function(){
        const monitors = this.monitors();
        const allTasks = this.tasks();
        var events     = this.events();

        return function(){ // scheduler needs a function
            var date = new Date().toISOString();
            console.log('scheduler> '+ date.replace(/T/, ' ').replace(/\..+/, ''));

            var tasks = allTasks instanceof Array ? allTasks : [allTasks];
            var date = new Date();
            tasks.forEach(function(tsk){ // each task (with multiple devices)
                //console.log(JSON.stringify(tsk));
                tsk.runId = date.getTime();
                if(monitors[tsk.module]){ // verify if monitor is installed
                    monitors[tsk.module](tsk, events);  // TODO: verify recurrence
                } else console.log("module not installed: "+ tsk.module);
            });
        }
    },

    events: function(){
        return function(err, results){
            if(err) console.log("Error:" + err);
            console.log(JSON.stringify(results));
        }
    },

	tasks: function(){
        console.log('> loading tasks');
        // TODO: load tasks from a database
        const tasks = require(confs.tasksFile).tasks;
        return tasks;
	},

	monitors: function(){
        console.log('> loading monitors');
        const monitors = require(confs.monitorsDir);
        return monitors;
    }

};
