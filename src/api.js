(function (adhoc, Q) {

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

    var LocalTask = function (fn, input, timeout) {

    };

    var runLocalTask = function (fn, input, retries, timeout) {
        var strippedFunction = stripFunction(fn);
        var fnStr = strippedFunction.body;
        var d = Q.defer();
        var lambda = window.eval(makeLambdaStr(fnStr)); /* jshint ignore:line */
        var result = lambda.apply(input, []);
        d.resolve(result);
        return d.promise;
    };

    var runCloudTask = function (fn, input) {

    };

    var runLocalBatch = function (fn, inputslist) {
        var taskPromises = [];
        inputslist.forEach(function (argvals) {
            var input = _.object(strippedFunction.args, argvals);
            taskPromises.push(runLocalTask(fnStr, input));
        });
        return Q.all(taskPromises);
    };

    var contextConfig = null;
    var runCloudBatch = function (fn, inputslist, config) {

    };

    var runMixedBatch = function (fn, inputslist, config) {

    };

    var withCloud = function (config, block) {
        var oldConfig = contextConfig;
        contextConfig = config;
        var retval = block();
        contextConfig = oldConfig;
        return retval;
    };

    var callAsync = function (fn, args) {
        return Q.all(args).then(function (vals) {
            return fn.call(args);
        });
    };

    _(adhoc).extend({
        // dollar object holds functions that should
        // be considered private, but are exported, because it's nice
        // to unittest them
        $: {
            stripFunction: stripFunction
        },
        applyAsync: callAsync,
        runLocalTask: runLocalTask,
        runCloudTask: runCloudTask,
        runLocalBatch: runLocalBatch,
        runCloudBatch: runCloudBatch,
        runMixedBatch: runMixedBatch,
        withCloud: function () {}
    });

})(window.adhoc, window.Q);