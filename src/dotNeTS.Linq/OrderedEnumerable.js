var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dotNeTS;
(function (dotNeTS) {
    var OrderedEnumerable = (function (_super) {
        __extends(OrderedEnumerable, _super);
        function OrderedEnumerable(parent) {
            //this.lazyExpressions = new Array<dotNeTS.IExpressionFunc>();
            //_.forEach(parent.lazyExpressions,  (exp) => {
            //    this.lazyExpressions.push(exp);
            //});
            _super.call(this, parent.protectedInnerCollection);
        }
        OrderedEnumerable.prototype.getEvaluatedCollection = function () {
            _super.prototype.getEvaluatedCollection.call(this);
            return this.EvaluateOrderBy();
        };
        OrderedEnumerable.prototype.AddLazyOrderInternal = function (callback, sortOrder) {
            if (!this.sortExpressions) {
                this.sortExpressions = new Array();
            }
            this.sortExpressions.push({
                expression: callback,
                sortOrder: sortOrder
            });
        };
        OrderedEnumerable.prototype.OrderBy = function (keySelector) {
            this.sortExpressions = undefined;
            this.AddLazyOrderInternal(keySelector, 0 /* ASC */);
            return this;
        };
        OrderedEnumerable.prototype.OrderByDecending = function (callback) {
            this.sortExpressions = undefined;
            this.AddLazyOrderInternal(callback, 1 /* DESC */);
            return this;
        };
        OrderedEnumerable.prototype.ThenBy = function (callback) {
            var newOrdered = new OrderedEnumerable(this);
            newOrdered.sortExpressions = _.clone(this.sortExpressions);
            newOrdered.AddLazyOrderInternal(callback, 0 /* ASC */);
            return newOrdered;
        };
        OrderedEnumerable.prototype.ThenByDecending = function (callback) {
            var newOrdered = new OrderedEnumerable(this);
            newOrdered.sortExpressions = _.clone(this.sortExpressions);
            newOrdered.AddLazyOrderInternal(callback, 1 /* DESC */);
            return newOrdered;
        };
        OrderedEnumerable.prototype.EvaluateOrderBy = function () {
            var _this = this;
            if (this.sortExpressions) {
                this.protectedInnerCollection.sort(function (e1, e2) {
                    var sortReturn = 0;
                    _.forEach(_this.sortExpressions, function (exp) {
                        var order = exp.sortOrder;
                        var e1Exp = exp.expression.call(this, e1);
                        var e2Exp = exp.expression.call(this, e2);
                        if (e1Exp > e2Exp || e2Exp === null && !(e1Exp === null || e1Exp === undefined)) {
                            sortReturn = order === 0 /* ASC */ ? 1 : -1;
                            return false;
                        }
                        if (e1Exp < e2Exp || (e1Exp === null && !(e2Exp === null || e2Exp === undefined))) {
                            sortReturn = order === 0 /* ASC */ ? -1 : 1;
                            return false;
                        }
                    });
                    return sortReturn;
                });
            }
            return this.protectedInnerCollection;
        };
        OrderedEnumerable.prototype.Dispose = function () {
            delete this.sortExpressions;
            _super.prototype.Dispose.call(this);
        };
        return OrderedEnumerable;
    })(dotNeTS.Enumerable);
    dotNeTS.OrderedEnumerable = OrderedEnumerable;
})(dotNeTS || (dotNeTS = {}));
//# sourceMappingURL=OrderedEnumerable.js.map
