/// <reference path="../../typings/lodash/lodash.d.ts" />
'use strict';
var dotNeTS;
(function (dotNeTS) {
    var Enumerable = (function () {
        function Enumerable(innerArray) {
            this.innerArray = innerArray || [];
        }
        Enumerable.prototype.getEvaluatedCollection = function () {
            return this.EvaluateExpressions();
        };
        Object.defineProperty(Enumerable.prototype, "innerArray", {
            get: function () {
                if (!this.protectedInnerCollection) {
                    this.protectedInnerCollection = new Array();
                }
                return this.getEvaluatedCollection();
            },
            set: function (innerArray) {
                this.protectedInnerCollection = innerArray;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Enumerable.prototype, "length", {
            get: function () {
                if (!this.protectedInnerCollection) {
                    this.protectedInnerCollection = new Array();
                }
                return this.protectedInnerCollection.length;
            },
            set: function (newLength) {
                if (!this.protectedInnerCollection) {
                    this.protectedInnerCollection = new Array();
                }
                this.protectedInnerCollection.length = newLength;
            },
            enumerable: true,
            configurable: true
        });

        Enumerable.prototype.EvaluateExpressions = function () {
            var _this = this;
            if (this.lazyExpressions) {
                _.forEach(this.lazyExpressions, function (expression) {
                    _this.protectedInnerCollection = dotNeTS.EnumerableExpressionDefenitions.ExcecuteExpression(_this.protectedInnerCollection, expression);
                });
            }
            return this.protectedInnerCollection;
        };
        Enumerable.prototype.Unique = function (callback) {
            var o = {}, i, l = this.innerArray.length, r = [];
            for (i = 0; i < l; i += 1) {
                var value = callback(this.innerArray[i], i, this.innerArray);

                o[value] = value;
            }
            for (i in o) {
                r.push(o[i]);
            }
            return r;
        };
        Enumerable.prototype.Aggregate = function (callback) {
            var aggregatedResult = null, res;
            if (this.innerArray.length === 1) {
                return this.innerArray[0];
            }
            for (var i = 0; i < this.innerArray.length; i++) {
                if (i > 0) {
                    aggregatedResult = callback(aggregatedResult || this.innerArray[i - 1], this.innerArray[i], i, this.innerArray);
                }
            }
            return aggregatedResult;
        };
        Enumerable.prototype.Sum = function (selector) {
            var array;
            if (selector !== undefined) {
                array = this.Select(selector).ToArray();
                return array.reduce(function (a, b) {
                    return a + b;
                });
            } else {
                array = this.innerArray;
            }
            if (array !== undefined && array !== null) {
                var sumArray = _.where(array, function (b) {
                    return !!b;
                });
                var result = sumArray.reduce(function (a, b) {
                    return a + b;
                });

                return !isNaN(result) ? result : 0;
            }

            return 0;
        };
        Enumerable.prototype.Max = function (selector) {
            var max;
            if (selector !== undefined) {
                max = this.Select(selector).OrderByDecending(function (b) {
                    return b;
                }).FirstOrDefault();
            } else {
                max = this.OrderByDecending(function (b) {
                    return b;
                }).FirstOrDefault();
            }
            if (max !== undefined && max !== null) {
                return !isNaN(max) ? max : 0;
            }
            return 0;
        };
        Enumerable.prototype.Min = function (selector) {
            var min;
            if (selector !== undefined) {
                min = this.Select(selector).OrderBy(function (b) {
                    return b;
                }).FirstOrDefault();
            } else {
                min = this.OrderBy(function (b) {
                    return b;
                }).FirstOrDefault();
            }
            if (min !== undefined && min !== null) {
                return !isNaN(min) ? min : 0;
            }
            return 0;
        };
        Enumerable.prototype.GroupByNumberKey = function (callback) {
            var listOfGroupings = new dotNeTS.List();
            var grouped = _.groupBy(this.innerArray, callback);
            _.forEach(grouped, function (group, key) {
                listOfGroupings.Add(new dotNeTS.Grouping(parseFloat(key), group));
            });
            return listOfGroupings;
        };
        Enumerable.prototype.GroupByStringKey = function (callback) {
            var listOfGroupings = new dotNeTS.List();
            var grouped = _.groupBy(this.innerArray, callback);
            _.forEach(grouped, function (group, key) {
                listOfGroupings.Add(new dotNeTS.Grouping(key, group));
            });
            return listOfGroupings;
        };
        Enumerable.prototype.GroupBy = function (callback) {
            var listOfGroupings = new dotNeTS.List();
            this.ForEach(function (item, index, col) {
                var resultFound = false;
                var result = callback(item, index, col);

                listOfGroupings.ForEach(function (innerItem, innerIndex, innerCol) {
                    if (typeof result === 'object' && typeof innerItem === 'object') {
                        _.forEach(result, function (groupResultValue, groupResultKey, col) {
                            if (innerItem.Key[groupResultKey] === groupResultValue) {
                                innerItem.Add(item);
                                resultFound = true;
                                return false;
                            }
                        });
                    } else {
                        if (innerItem && innerItem.Key === result) {
                            innerItem.Add(item);
                            resultFound = true;
                            return false;
                        }
                    }
                });
                if (!resultFound) {
                    listOfGroupings.Add(new dotNeTS.Grouping(result, [item]));
                }
            });

            return listOfGroupings;
        };
        Enumerable.prototype.ElementAt = function (index) {
            if (index >= this.Count()) {
                throw new dotNeTS.ArgumentOutOfRangeException("Index was out of range. Must be non-negative and less than the size of the collection.");
            }
            return this.innerArray[index];
        };
        Enumerable.prototype.ElementAtOrDefault = function (index) {
            if (this.innerArray && this.Count() > index) {
                return this.innerArray[index];
            }
            return null;
        };

        //Return false to break
        Enumerable.prototype.ForEach = function (callback) {
            _.forEach(this.innerArray, callback);
        };
        Enumerable.prototype.Contains = function (item) {
            return _.contains(this.innerArray, item);
        };
        Enumerable.prototype.OrderBy = function (keySelector) {
            var ordered = new dotNeTS.OrderedEnumerable(this);
            this.CopyExpressions(ordered);
            return ordered.OrderBy(keySelector);
        };

        Enumerable.prototype.OrderByDecending = function (callback) {
            var ordered = new dotNeTS.OrderedEnumerable(this);
            this.CopyExpressions(ordered);
            return ordered.OrderByDecending(callback);
        };
        Enumerable.prototype.First = function (predicate) {
            if (!this.Any()) {
                throw new dotNeTS.InvalidOperationException("Sequence contains no elements");
            }
            var result = this.FirstOrDefault(predicate);
            if (!result) {
                throw new dotNeTS.InvalidOperationException("Sequence contains no matching element");
            }
            return result;
        };
        Enumerable.prototype.FirstOrDefault = function (predicate) {
            if (!this.Any()) {
                return null;
            }
            if (predicate) {
                var result = _.find(this.innerArray, predicate);
                if (!result) {
                    return null;
                }
                return result;
            }
            return this.innerArray[0] || null;
        };
        Enumerable.prototype.Single = function (predicate) {
            if (!this.Any()) {
                throw new dotNeTS.InvalidOperationException("Sequence contains no elements");
            }
            if (predicate) {
                var elements = _.where(this.innerArray, predicate);
                var count = elements.length;
                if (count === 0) {
                    throw new dotNeTS.InvalidOperationException("Sequence contains no matching elements");
                }
                if (count > 1) {
                    throw new dotNeTS.InvalidOperationException("Sequence contains more than one matching element");
                }
                return elements[0];
            }
            if (this.innerArray.length > 1) {
                throw new dotNeTS.InvalidOperationException("Sequence contains more than one matching element");
            }
            return this.innerArray[0] || null;
        };

        Enumerable.prototype.SingleOrDefault = function (predicate) {
            if (!this.Any()) {
                return null;
            }
            if (predicate) {
                var elements = _.where(this.innerArray, predicate);
                var count = elements.length;
                if (count === 0) {
                    return null;
                }
                if (count > 1) {
                    return null;
                }
                return elements[0];
            }
            if (this.innerArray.length > 1) {
                return null;
            }
            return this.innerArray[0] || null;
        };

        Enumerable.prototype.Any = function (predicate) {
            if (predicate) {
                return _.any(this.innerArray, predicate);
            }
            return this.Count() > 0;
        };

        Enumerable.prototype.Count = function (predicate) {
            if (predicate) {
                return _.where(this.innerArray, predicate).length;
            }
            return this.innerArray.length;
        };

        Enumerable.prototype.Select = function (callback) {
            return new Enumerable(_.map(this.innerArray, callback));
        };
        Enumerable.prototype.SelectMany = function (callback) {
            var array = [];
            this.ForEach(function (element, index, list) {
                if (callback !== undefined) {
                    var res = callback(element, index, list);
                    if (res !== undefined) {
                        array = array.concat(res);
                    }
                }
            });
            return new Enumerable(array);
        };
        Enumerable.prototype.Where = function (predicate) {
            return this.CopyExpressions(new Enumerable(this.protectedInnerCollection), {
                func: predicate,
                type: 0 /* Where */
            });
        };

        Enumerable.prototype.CopyExpressions = function (enumerable, lastExpression) {
            enumerable.lazyExpressions = new Array();
            _.forEach(this.lazyExpressions, function (exp) {
                enumerable.lazyExpressions.push(exp);
            });
            if (lastExpression) {
                enumerable.lazyExpressions.push(lastExpression);
            }
            return enumerable;
        };

        Enumerable.prototype.ToArray = function () {
            return this.innerArray;
        };

        Enumerable.prototype.ToList = function () {
            return new dotNeTS.List(this.innerArray);
        };

        Enumerable.prototype.Dispose = function () {
            this.lazyExpressions = undefined;
            this.protectedInnerCollection = undefined;
        };
        return Enumerable;
    })();
    dotNeTS.Enumerable = Enumerable;
})(dotNeTS || (dotNeTS = {}));
//# sourceMappingURL=Enumerable.js.map
