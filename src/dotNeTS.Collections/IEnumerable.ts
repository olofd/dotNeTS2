module dotNeTS {
    export interface IEnumerable<TSource> extends IDisposable {
        innerArray: Array<TSource>;
        length: number;
        lazyExpressions: Array<IExpressionFunc>;
        ForEach(callback: dotNeTS.IFunc<TSource, void>): void
        Contains(item: TSource): boolean;
        GroupBy<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<IGrouping<TResult, TSource>>;
        GroupByNumberKey(callback: IFunc<TSource, number>): IEnumerable<IGrouping<number, TSource>>;
        GroupByStringKey(callback: IFunc<TSource, string>): IEnumerable<IGrouping<string, TSource>>;
        OrderBy<TKey>(keySelector: dotNeTS.IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
        OrderByDecending<TKey>(callback: IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
        First(predicate?: IFunc<TSource, boolean>): TSource;
        FirstOrDefault(predicate?: IFunc<TSource, boolean>): TSource;
        Single(predicate?: IFunc<TSource, boolean>): TSource;
        SingleOrDefault(predicate?: IFunc<TSource, boolean>): TSource;
        Any(predicate?: IFunc<TSource, boolean>): boolean;
        Count(predicate?: IFunc<TSource, boolean>): number;
        Select<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<TResult>;
        Where(predicate?: IFunc<TSource, boolean>): IEnumerable<TSource>;
        ToArray(): TSource[];
        ToList(): IList<TSource>;
        Unique<TResult>(callback: IFunc<TSource, TResult>): Array<TResult>;
        Aggregate<TResult>(callback: IAgreggateFunc<TSource, TResult>): TResult;


    }
}