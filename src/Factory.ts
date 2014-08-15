module dotNeTS {
    export function createList<T>(startArray?: T[]): dotNeTS.List<T> {
        return new dotNeTS.List<T>(startArray);
    }

    var getTimestamp;
    if (window.performance.now) {
        getTimestamp = function () { return window.performance.now(); };
    }
     export function MeasureTime(operation, numberOfTimes, name?) {
        var t1 = getTimestamp(), res;
        for (var i = 0; i < numberOfTimes; i++) {
            operation();
        }
        var t2 = getTimestamp();

        console.log("Time Operation: " + name + " ::  " + (t2 - t1));
    }
} 