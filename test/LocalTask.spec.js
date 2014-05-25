describe('LocalTask', function () {
    var LocalTask = adhoc.LocalTask;

    it('should have uuid assigned after creation', function () {
        var task = new LocalTask('return x + y;', {x: 1, y: 2});
        expect(task.uuid).toBeDefined(); //
    });

    describe('LocalTask.$grabWorker', function () {
        it('should return first idle worker/callback dict if idle worker present', function () {
            var idle = ["worker1", "worker2"];
            var active = {};
            var w = LocalTask.$grabWorker("someUid", idle, active);
            expect(typeof w.callback).toEqual('function');
            expect(w.worker).toEqual("worker1");
        });
        it('should put the worker to active dict if present next to callback', function () {
            var idle = ["worker1", "worker2"];
            var active = {};
            LocalTask.$grabWorker("someUid", idle, active);
            expect(typeof active.someUid.callback).toEqual('function');
            expect(active.someUid.worker).toEqual('worker1');
        });
        it('should remove worker from idle list', function () {
            var idle = ["worker1", "worker2", "worker3"];
            var active = {};
            LocalTask.$grabWorker("someUid", idle, active);
            expect(idle).toEqual(["worker2", "worker3"]);
        });
        it('should return null if idle list is empty', function () {
            var idle = [];
            var active = {};
            console.log(LocalTask.$grabWorker("asd", idle, active));
            expect(LocalTask.$grabWorker("someUid", idle, active)).toBeNull();
        });
    });
});
