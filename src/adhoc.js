(function (window, Worker) {

    /* create 4 workers ahead of time */
    var idleWorkers = [
        new Worker('worker.js'),
        new Worker('worker.js'),
        new Worker('worker.js'),
        new Worker('worker.js')
    ];
    var activeWorkers = {};
    _.each();

    var jobPromises = {};

    /* this is copypasta from angular */
    var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
    var FN_ARG_SPLIT = /,/;
    var FN_ARG = /^\s*(_?)(.+?)\1\s*$/;
    var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var functionArgs = function(fnStr) {
        var args = [];
        var fnText = fnStr.replace(STRIP_COMMENTS, '');
        var argDecl = fnText.match(FN_ARGS);
        argDecl[1].split(FN_ARG_SPLIT).forEach(function(arg){
            arg.replace(FN_ARG, function(all, underscore, name){
                args.push(name);
            });
        });
        return args;
    };

    var functionBody = function(fnStr) {
        return fnStr.match(/function[^{]+\{([\s\S]*)\}$/)[1];
    };

    var stripFunction = function(fn) {
        var fnStr = fn.toString();
        return {
            args: functionArgs(fnStr),
            body: functionBody(fnStr)
        };
    };

    var makeLambdaStr = function (fnBody) {
        var prefix = "(function (input) {";
        var suffix = "});";
        return prefix + fnBody + suffix;
    };

    var grabLocalWorker = function (jobUuid, idleWorkers, activeWorkers) {
        var w = idleWorkers[0];
        if (w) {
            idleWorkers.splice(0, 1);
            activeWorkers[jobUuid] = w;
        }
        return w;
    };

    var releaseLocalWorker = function (jobUuid, idleWorkers, activeWorkers) {
        var w = activeWorkers[jobUuid];
        delete activeWorkers[jobUuid];
        idleWorkers.push(w);
    };

    var runLocalTask = function(fnStr, input) {
        var d = Q.defer();
        var lambda = window.eval(makeLambdaStr(fnStr)); /* jshint ignore:line */
        var result = lambda.apply(input, []);
        d.resolve(result);
        return d.promise;
    };

    var runBatch = function(fn, inputslist, cloud) {
        var taskPromises = [];
        var strippedFunction = stripFunction(fn);
        inputslist.forEach(function (argvals) {
            var input = _.object(strippedFunction.args, argvals);
            var fnStr = strippedFunction.body;
            taskPromises.push(runLocalTask(fnStr, input));
        });
        return Q.all(taskPromises);
    };

    window.adhoc = {
        stripFunction: stripFunction,
        runBatch: runBatch
    };
})(window, Worker);