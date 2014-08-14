var dotNeTS;
(function (dotNeTS) {
    var EnumerableExpressionDefenitions = (function () {
        function EnumerableExpressionDefenitions() {
        }
        EnumerableExpressionDefenitions.ExcecuteExpression = function (array, exp) {
            switch (exp.type) {
                case 0 /* Where */:
                    return EnumerableExpressionDefenitions.Where(array, exp.func);
            }

            return null;
        };

        EnumerableExpressionDefenitions.Where = function (array, exp) {
            return _.where(array, exp);
        };
        return EnumerableExpressionDefenitions;
    })();
    dotNeTS.EnumerableExpressionDefenitions = EnumerableExpressionDefenitions;
})(dotNeTS || (dotNeTS = {}));
//# sourceMappingURL=EnumerableExpressionDefenitions.js.map
