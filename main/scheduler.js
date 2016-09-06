'use strict';
const confs = require('./configs/config');
const schedule = require('node-schedule');
var events = {}; //  all ocurrencies object

// TODO: put in a function
// zeromq publisher ( install libs first: "brew install pkg-config zmq" on OSX)
// simple setup.... see "subs.js" for a simple command line subscriber implementation

const zmq = require('zmq');
const publisher = zmq.socket('pub');
publisher.bind('tcp://*:'+confs.zmq.port,
    (err) => console.log("> listening for ZMQ Subscribers on port:" + confs.zmq.port)
)
module.exports = {
    start: function(){ return schedule.scheduleJob(confs.runInterval, this.run()); },

    once: function(){ this.run(); },

    stop: function(){ this.start().cancel(); },

    run: function(){
        const monitors = this.monitors();
        const equips   = this.equips();
        const allTasks = this.tasks();
        const update   = this.update;
        const enqueue  = this.enqueue;

        var tasks = allTasks instanceof Array ? allTasks : [allTasks];

        return function(){
            console.time("pingTime");
            var date = new Date().toISOString();
            console.log('scheduler> '+ date.replace(/T/, ' ').replace(/\..+/, ''));

            //Promise.all(tasks.map( tsk => {
            //    equips[tsk.module].map( eq => {
            //        tsk.dev = eq;
            //        var prm = monitors[tsk.module].run(tsk);
            //        prm.then( update ).then( enqueue );//.then( JSON.stringify ).then( console.log );
            //    });
            //})).then(console.timeEnd("pingTime"));


            tasks.map( tsk => {
                equips[tsk.module].map( eq => {
                    tsk.dev = eq;
                    var prm = monitors[tsk.module].run(tsk);
                    prm.then( update ).then( enqueue );//.then( JSON.stringify ).then( console.log );
                });
            });
        };

    },

    update: function(tsk){ //monitors, tsk
        var eventName = tsk.device + '@' + tsk.task;
        return new Promise((resolve, reject) => {
            if(tsk.status < 0) {            // fail
                if(!events[eventName]) {    // new fail
                    tsk.elapsed = 0;
                    tsk.start = tsk.time;
                } else {                    // old fail, update time
                    tsk.elapsed = Math.round((tsk.time - events[eventName].time)/1000) + events[eventName].elapsed;
                    tsk.start = events[eventName].start;
                }
                events[eventName] = tsk;
            } else {
                if(events[eventName]){      // recovery
                    tsk.end = tsk.run;
                    // log/inform outage         <------------- TODO: check flapping, dump to DB
                    delete events[eventName];
                }
            }

            if(events[eventName]) resolve(events[eventName]);
        });
    },

    enqueue: function(tsk){
        return new Promise((resolve, reject) => {
            resolve(publisher.send([confs.queueId+"."+tsk.task, JSON.stringify(tsk)]));
        });
    },

    tasks: function(){
        console.log('> loading tasks');
        // TODO: load tasks from a database
        const tasks = require(confs.tasksFile).tasks;  // obj array with tasks to be executed
        return tasks;
    },

    monitors: function(){
        console.log('> loading monitors');
        const monitors = require(confs.monitorsDir);  // function array with task implementation
        return monitors;
    },

    equips: function(){
        console.log('> loading equipments');
        const equips = require(confs.equipFile);  // function array with task implementation
        return equips;
    }
}
