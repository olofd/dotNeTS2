module dotNeTS {
    export class OrderedEnumerable<TSource> extends dotNeTS.Enumerable<TSource> implements IOrderedEnumerable<TSource>{
        constructor(parent: dotNeTS.Enumerable<TSource>) {
            //this.lazyExpressions = new Array<dotNeTS.IExpressionFunc>();
            //_.forEach(parent.lazyExpressions,  (exp) => {
            //    this.lazyExpressions.push(exp);
            //});
            super(parent.protectedInnerCollection);

        }
        private sortExpressions: Array<ISortExpression<TSource>>;
        public getEvaluatedCollection(): TSource[] {
            super.getEvaluatedCollection();
            return this.EvaluateOrderBy();
        }
        private AddLazyOrderInternal<TKey>(callback: IFunc<TSource, TKey>, sortOrder: SortOrder): void {
            if (!this.sortExpressions) {
                this.sortExpressions = new Array<any>();
            }
            this.sortExpressions.push({
                expression: callback,
                sortOrder: sortOrder
            });
        }
        OrderBy<TKey>(keySelector: IFunc<TSource, TKey>): IOrderedEnumerable<TSource> {
            this.sortExpressions = undefined;
            this.AddLazyOrderInternal(keySelector, SortOrder.ASC);
            return this;
        }
        OrderByDecending<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource> {
            this.sortExpressions = undefined;
            this.AddLazyOrderInternal(callback, SortOrder.DESC);
            return this;
        }
        ThenBy<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource> {
            var newOrdered = new OrderedEnumerable(this);
            newOrdered.sortExpressions = _.clone(this.sortExpressions);
            newOrdered.AddLazyOrderInternal(callback, SortOrder.ASC);
            return newOrdered;
        }
        ThenByDecending<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource> {
            var newOrdered = new OrderedEnumerable(this);
            newOrdered.sortExpressions = _.clone(this.sortExpressions);
            newOrdered.AddLazyOrderInternal(callback, SortOrder.DESC);
            return newOrdered;
        }
        private EvaluateOrderBy(): TSource[] {
            if (this.sortExpressions) {
                this.protectedInnerCollection.sort((e1, e2) => {
                    var sortReturn = 0;
                    _.forEach(this.sortExpressions, function (exp) {
                        var order = exp.sortOrder;
                        var e1Exp = exp.expression.call(this, e1);
                        var e2Exp = exp.expression.call(this, e2);
                        if (e1Exp > e2Exp) {
                            sortReturn = order === SortOrder.ASC ? 1 : -1;
                            return false;
                        }
                        if (e1Exp < e2Exp) {
                            sortReturn = order === SortOrder.ASC ? -1 : 1;
                            return false;
                        }
                    });
                    return sortReturn;
                });
            }
            return this.protectedInnerCollection;
        }
        Dispose() {
            delete this.sortExpressions;
            super.Dispose();
        }
    }
}