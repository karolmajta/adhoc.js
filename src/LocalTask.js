(function (adhoc) {

    var LocalTask = function () {

    };

    LocalTask.grabWorker = function (jobUuid, idleWorkers, activeWorkers) {
        var w = idleWorkers[0];
        if (w) {
            idleWorkers.splice(0, 1);
            activeWorkers[jobUuid] = w;
        }
        return w;
    };

    LocalTask.releaseWorker = function (jobUuid, idleWorkers, activeWorkers) {
        var w = activeWorkers[jobUuid];
        delete activeWorkers[jobUuid];
        idleWorkers.push(w);
    };

    _(adhoc).extend({
        LocalTask: LocalTask
    });

})(window.adhoc);