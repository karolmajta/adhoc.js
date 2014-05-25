(function (window, adhoc, Q) {

    var rejectionTemplate = _.template(
        "LocalTask `<%= uuid %>` timed out after <%= retries %> retries (<%= milis %>ms)"
    );

    var LocalTask = function (fnStr, input, timeout, maxRetries) {
        timeout = timeout ? timeout : 0;
        maxRetries = maxRetries ? maxRetries : Infinity;
        var scheduledAt = new Date();

        var scheduleWithDeferred = function (fnStr, input, timeout, maxRetries, deferred, retryNo, msgId) {
            var w = LocalTask.$grabWorker(this.uuid, adhoc.idleWorkers, adhoc.activeWorkers);
            if (w) {
                w.callback = function (result) {
                    LocalTask.$releaseWorker(this.uuid, adhoc.idleWorkers, adhoc.activeWorkers);
                    deferred.resolve(result);
                };
                w.worker.postMessage({
                    task: msgId,
                    code: fnStr,
                    inputs: [input]
                });
            } else if (!timeout || retryNo >= maxRetries) {
                var now = new Date();
                var msg = {
                    uuid: this.uuid,
                    retries: retryNo,
                    milis: now.getTime() - scheduledAt.getTime()
                };
                d.reject(rejectionTemplate(msg));
            } else {
                var newRetryNo = retryNo + 1;
                var newTimeout = Math.pow(2, retryNo);
                window.setTimeout(function () {
                    scheduleWithDeferred(fnStr, input, newTimeout, maxRetries, deferred, newRetryNo, msgId);
                }, timeout);
            }
        };

        this.uuid = UUIDjs.create().toString();
        this.schedule = function () {
            var d = Q.defer();
            scheduleWithDeferred(fnStr, input, timeout, maxRetries, d, 0, this.uuid);
            return d.promise;
        };
    };

    LocalTask.$grabWorker = function (jobUuid, idleWorkers, activeWorkers) {
        var w = idleWorkers[0];
        if (w) {
            idleWorkers.splice(0, 1);
            activeWorkers[jobUuid] = {
                worker: w,
                callback: function (result) {}
            };
        }
        var r = activeWorkers[jobUuid];
        return r ? r : null;
    };

    LocalTask.$releaseWorker = function (jobUuid, idleWorkers, activeWorkers) {
        var w = activeWorkers[jobUuid];
        delete activeWorkers[jobUuid];
        if (w) {
            idleWorkers.push(w.worker);
        }
    };

    adhoc.LocalTask = LocalTask;

})(window, window.adhoc, window.Q);