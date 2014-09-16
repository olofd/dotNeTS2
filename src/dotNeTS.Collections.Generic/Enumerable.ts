/// <reference path="../../typings/lodash/lodash.d.ts" />

'use strict';
module dotNeTS {
    export class Enumerable<TSource> implements IEnumerable<TSource> {
        public protectedInnerCollection: Array<TSource>;
        public lazyExpressions: Array<IExpressionFunc>;

        constructor(innerArray?: Array<TSource>) {
            this.innerArray = innerArray || [];

        }
        public getEvaluatedCollection() {
            return this.EvaluateExpressions();
        }
        get innerArray(): Array<TSource> {
            if (!this.protectedInnerCollection) {
                this.protectedInnerCollection = new Array<TSource>();
            }
            return this.getEvaluatedCollection();
        }
        set innerArray(innerArray: Array<TSource>) {
            this.protectedInnerCollection = innerArray;
        }
        get length(): number {
            if (!this.protectedInnerCollection) {
                this.protectedInnerCollection = new Array<TSource>();
            }
            return this.protectedInnerCollection.length;
        }
        set length(newLength: number) {
            if (!this.protectedInnerCollection) {
                this.protectedInnerCollection = new Array<TSource>();
            }
            this.protectedInnerCollection.length = newLength;
        }


        private EvaluateExpressions(): TSource[] {
            if (this.lazyExpressions) {
                _.forEach(this.lazyExpressions, (expression: IExpressionFunc) => {
                    this.protectedInnerCollection = EnumerableExpressionDefenitions.ExcecuteExpression(this.protectedInnerCollection, expression);
                });
            }
            return this.protectedInnerCollection;
        }
        Unique(callback: IFunc<TSource, string>): Array<TSource> {
            var o = {}, i, l = this.innerArray.length, r = [];
            for (i = 0; i < l; i += 1) {
                var value = callback(this.innerArray[i], i, this.innerArray);

                o[value] = value;
            }
            for (i in o) {
                r.push(o[i]);
            }
            return r;

        }
        Aggregate(callback: IAgreggateFunc<TSource, TSource>): TSource {
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

        }
        Sum(selector?: IFunc<TSource, number>): number {
            var array;
            if (selector !== undefined) {
                array = this.Select<number>(selector).ToArray();
                return array.reduce((a, b) => {
                    return a + b;
                });
            } else {
                array = (<any>this.innerArray);
            }
            if (array !== undefined && array !== null) {
                var sumArray = _.where(array, b => !!b);
                var result = (<any>sumArray).reduce((a, b) => {
                    return a + b;
                });

                return !isNaN(result) ? result : 0;
            }

            return 0;
        }
        Max(selector?: IFunc<TSource, number>): number {
            var max;
            if (selector !== undefined) {
                max = this.Select(selector).OrderByDecending(b => b).FirstOrDefault();
            } else {
                max = this.OrderByDecending(b => b).FirstOrDefault();
            }
            if (max !== undefined && max !== null) {
                return !isNaN(max) ? max : 0;
            }
            return 0;
        }
        Min(selector?: IFunc<TSource, number>): number {
            var min;
            if (selector !== undefined) {
                min = this.Select(selector).OrderBy(b => b).FirstOrDefault();
            } else {
                min = this.OrderBy(b => b).FirstOrDefault();
            }
            if (min !== undefined && min !== null) {
                return !isNaN(min) ? min : 0;
            }
            return 0;
        }
        GroupByNumberKey(callback: IFunc<TSource, number>): IEnumerable<IGrouping<number, TSource>> {
            var listOfGroupings = new List<Grouping<number, TSource>>();
            var grouped = _.groupBy(this.innerArray, callback);
            _.forEach(grouped, function (group, key) {
                listOfGroupings.Add(new Grouping(parseFloat(key), group));
            });
            return listOfGroupings;
        }
        GroupByStringKey(callback: IFunc<TSource, string>): IEnumerable<IGrouping<string, TSource>> {
            var listOfGroupings = new List<Grouping<string, TSource>>();
            var grouped = _.groupBy(this.innerArray, callback);
            _.forEach(grouped, function (group, key) {
                listOfGroupings.Add(new Grouping(key, group));
            });
            return listOfGroupings;
        }
        GroupBy<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<IGrouping<TResult, TSource>> {
            var listOfGroupings = new List<Grouping<TResult, TSource>>();
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
                    }else
                    {
                        if (innerItem && innerItem.Key === result) {
                            innerItem.Add(item);
                            resultFound = true;
                            return false;
                        }
                    }


                });
                if (!resultFound) {
                    listOfGroupings.Add(new Grouping(result, [item]));
                }
            });

            return listOfGroupings;
        }
        ElementAt(index: number): TSource {
            if (index >= this.Count()) {
                throw new ArgumentOutOfRangeException("Index was out of range. Must be non-negative and less than the size of the collection.");
            }
            return this.innerArray[index];
        }
        ElementAtOrDefault(index: number): TSource {
            if (this.innerArray && this.Count() > index) {
                return this.innerArray[index];
            }
            return null;
        }
        //Return false to break
        ForEach(callback: dotNeTS.IFunc<TSource, void>): void {
            _.forEach(this.innerArray, callback);
        }
        Contains(item: TSource): boolean {
            return _.contains(this.innerArray, item);
        }
        OrderBy<TKey>(keySelector: dotNeTS.IFunc<TSource, TKey>): IOrderedEnumerable<TSource> {
            var ordered = new dotNeTS.OrderedEnumerable(this);
            this.CopyExpressions(ordered);
            return ordered.OrderBy(keySelector);
        }

        OrderByDecending<TKey>(callback: IFunc<TSource, TKey>): IOrderedEnumerable<TSource> {
            var ordered = new dotNeTS.OrderedEnumerable(this);
            this.CopyExpressions(ordered);
            return ordered.OrderByDecending(callback);
        }
        First(predicate?: IFunc<TSource, boolean>): TSource {
            if (!this.Any()) {
                throw new dotNeTS.InvalidOperationException("Sequence contains no elements");
            }
            var result = this.FirstOrDefault(predicate);
            if (!result) {
                throw new InvalidOperationException("Sequence contains no matching element");
            }
            return result;
        }
        FirstOrDefault(predicate?: IFunc<TSource, boolean>): TSource {
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
        }
        Single(predicate?: IFunc<TSource, boolean>): TSource {
            if (!this.Any()) {
                throw new InvalidOperationException("Sequence contains no elements");
            }
            if (predicate) {
                var elements = _.where(this.innerArray, predicate);
                var count = elements.length;
                if (count === 0) {
                    throw new InvalidOperationException("Sequence contains no matching elements");
                }
                if (count > 1) {
                    throw new InvalidOperationException("Sequence contains more than one matching element");
                }
                return elements[0];
            }
            if (this.innerArray.length > 1) {
                throw new InvalidOperationException("Sequence contains more than one matching element");
            }
            return this.innerArray[0] || null;
        }

        SingleOrDefault(predicate?: IFunc<TSource, boolean>): TSource {
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
        }

        Any(predicate?: IFunc<TSource, boolean>): boolean {
            if (predicate) {
                return _.any(this.innerArray, predicate);
            }
            return this.Count() > 0;
        }

        Count(predicate?: IFunc<TSource, boolean>): number {
            if (predicate) {
                return _.where(this.innerArray, predicate).length;
            }
            return this.innerArray.length;
        }

        Select<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<TResult> {
            return new Enumerable<TResult>(_.map(this.innerArray, callback));
        }
        SelectMany<TResult>(callback: IFunc<TSource, TResult[]>): IEnumerable<TResult> {
            var array = [];
            this.ForEach((element, index, list) => {
                if (callback !== undefined) {
                    var res = callback(element, index, list);
                    if (res !== undefined) {
                       array = array.concat(res);
                    }
                }

            });
            return new Enumerable<TResult>(array);
        }
        Where(predicate: IFunc<TSource, boolean>): IEnumerable<TSource> {
            return this.CopyExpressions(new Enumerable<TSource>(this.protectedInnerCollection), {
                func: predicate,
                type: IExpressionType.Where
            });
        }

        private CopyExpressions<TResult>(enumerable: IEnumerable<TResult>, lastExpression?: dotNeTS.IExpressionFunc): IEnumerable<TResult> {
            enumerable.lazyExpressions = new Array<dotNeTS.IExpressionFunc>();
            _.forEach(this.lazyExpressions, function (exp) {
                enumerable.lazyExpressions.push(exp);
            });
            if (lastExpression) {
                enumerable.lazyExpressions.push(lastExpression);
            }
            return enumerable;
        }

        ToArray(): TSource[] {
            return this.innerArray;
        }

        ToList(): IList<TSource> {
            return new List<TSource>(this.innerArray);
        }

        Dispose() {
            this.lazyExpressions = undefined;
            this.protectedInnerCollection = undefined;
        }

    }
}