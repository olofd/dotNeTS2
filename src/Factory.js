var dotNeTS;
(function (dotNeTS) {
    function createList(startArray) {
        return new dotNeTS.List(startArray);
    }
    dotNeTS.createList = createList;

    var getTimestamp;
    if (window.performance.now) {
        getTimestamp = function () {
            return window.performance.now();
        };
    }
    function MeasureTime(operation, numberOfTimes, name) {
        var t1 = getTimestamp(), res;
        for (var i = 0; i < numberOfTimes; i++) {
            operation();
        }
        var t2 = getTimestamp();

        console.log("Time Operation: " + name + " ::  " + (t2 - t1));
    }
    dotNeTS.MeasureTime = MeasureTime;
})(dotNeTS || (dotNeTS = {}));
//# sourceMappingURL=Factory.js.map
