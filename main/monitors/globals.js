// DO NOT EDIT THIS FILE

module.exports = {
    normalize: function(env) {
        return {
            task: env.taskId,
            time: new Date().getTime(),
            elapsed: null,
            device: env.dev,
            status: null
        };
    }
};