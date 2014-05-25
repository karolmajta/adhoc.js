(function (window) {
    if (window.adhoc) {
        throw new Error("adhoc.js: `window.adhoc` is already defined");
    } else {
        window.adhoc = {};
        var scripts = document.getElementsByTagName('script');
        var index = scripts.length - 1;
        var myScript = scripts[index];
        var workerUrl = myScript.src.replace('adhoc.js', 'adhoc.worker.js');
        /* create 4 workers ahead of time */
        window.adhoc.idleWorkers = [
            new Worker(workerUrl),
            new Worker(workerUrl),
            new Worker(workerUrl),
            new Worker(workerUrl)
        ];
        window.adhoc.activeWorkers = {};
        _.each(window.adhoc.idleWorkers, function (worker) {
            worker.onmessage = function (event) {
                var callback = window.adhoc.activeWorkers[event.data.uuid].callback;
                callback(event.data);
            };
        });
    }
})(window);