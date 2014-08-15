/// <reference path="../typings/lodash/lodash.d.ts" />
declare module dotNeTS {
    class Exception {
        public name: string;
        public level: string;
        public message: string;
        public htmlMessage: string;
        constructor(name: string, message: string);
        public toString(): string;
    }
}
declare module dotNeTS {
    function createList<T>(startArray?: T[]): List<T>;
    function MeasureTime(operation: any, numberOfTimes: any, name?: any): void;
}
declare module dotNeTS {
    class Enumerable<TSource> implements IEnumerable<TSource> {
        public protectedInnerCollection: TSource[];
        public lazyExpressions: IExpressionFunc[];
        constructor(innerArray?: TSource[]);
        public getEvaluatedCollection(): TSource[];
        public innerArray : TSource[];
        public length : number;
        private EvaluateExpressions();
        public Unique(callback: IFunc<TSource, string>): TSource[];
        public Aggregate<TResult>(callback: IFunc<TSource, TResult>): TResult;
        public GroupByNumberKey(callback: IFunc<TSource, number>): IEnumerable<IGrouping<number, TSource>>;
        public GroupByStringKey(callback: IFunc<TSource, string>): IEnumerable<IGrouping<string, TSource>>;
        public GroupBy<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<IGrouping<TResult, TSource>>;
        public ElementAt(index: number): TSource;
        public ElementAtOrDefault(index: number): TSource;
        public ForEach(callback: IFunc<TSource, void>): void;
        public Contains(item: TSource): boolean;
        public OrderBy<TKey>(keySelector: IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
        public OrderByDecending<TKey>(callback: IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
        public First(predicate?: IFunc<TSource, boolean>): TSource;
        public FirstOrDefault(predicate?: IFunc<TSource, boolean>): TSource;
        public Single(predicate?: IFunc<TSource, boolean>): TSource;
        public SingleOrDefault(predicate?: IFunc<TSource, boolean>): TSource;
        public Any(predicate?: IFunc<TSource, boolean>): boolean;
        public Count(predicate?: IFunc<TSource, boolean>): number;
        public Select<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<TResult>;
        public Where(predicate: IFunc<TSource, boolean>): IEnumerable<TSource>;
        private CopyExpressions<TResult>(enumerable, lastExpression?);
        public ToArray(): TSource[];
        public ToList(): IList<TSource>;
        public Dispose(): void;
    }
}
declare module dotNeTS {
    class EnumerableExpressionDefenitions<TSource> {
        static ExcecuteExpression<TSource>(array: TSource[], exp: IExpressionFunc): TSource[];
        static Where<TSource>(array: TSource[], exp: IFunc<TSource, boolean>): TSource[];
    }
}
declare module dotNeTS {
    interface IExpressionFunc {
        func: IFunc<any, any>;
        type: IExpressionType;
    }
}
declare module dotNeTS {
    enum IExpressionType {
        Where = 0,
        Select = 1,
        FirstOrDefault = 2,
    }
}
declare module dotNeTS {
    class List<TSource> extends Enumerable<TSource> implements IList<TSource>, IEnumerable<TSource>, IDisposable {
        constructor(innerArray?: TSource[]);
        public Add(item: TSource): void;
        public AddRange(collection: IEnumerable<TSource>): void;
        public Remove(item: TSource): void;
        public ReplaceWith(replaceItem: TSource, whereSelector: IComparer<TSource, boolean>): void;
        public RemoveAt(index: number): void;
        public Clear(): void;
        public IndexOf(item: TSource): number;
        public Insert(index: number, ...item: TSource[]): void;
        public Dispose(): void;
    }
}
declare module dotNeTS {
    interface IEnumerable<TSource> extends IDisposable {
        innerArray: TSource[];
        length: number;
        lazyExpressions: IExpressionFunc[];
        ForEach(callback: IFunc<TSource, void>): void;
        Contains(item: TSource): boolean;
        GroupBy<TResult>(callback: IFunc<TSource, TResult>): IEnumerable<IGrouping<TResult, TSource>>;
        GroupByNumberKey(callback: IFunc<TSource, number>): IEnumerable<IGrouping<number, TSource>>;
        GroupByStringKey(callback: IFunc<TSource, string>): IEnumerable<IGrouping<string, TSource>>;
        OrderBy<TKey>(keySelector: IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
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
        Unique<TResult>(callback: IFunc<TSource, TResult>): TResult[];
    }
}
declare module dotNeTS {
    interface IList<TSource> extends IEnumerable<TSource> {
        Add(item: TSource): void;
        AddRange(collection: IEnumerable<TSource>): void;
        Remove(item: TSource): void;
        RemoveAt(index: number): any;
        ReplaceWith(replaceItem: TSource, whereSelector: IComparer<TSource, boolean>): any;
        Clear(): void;
        Contains(item: TSource): boolean;
        IndexOf(item: TSource): number;
        Insert(index: number, item: TSource): void;
    }
}
declare module dotNeTS {
    class Grouping<TKey, TElement> extends List<TElement> implements IGrouping<TKey, TElement>, IEnumerable<TElement> {
        public Key: TKey;
        constructor(Key: TKey, innerArray: TElement[]);
    }
}
declare module dotNeTS {
    interface IGrouping<TKey, TElement> extends IEnumerable<TElement> {
        Key: TKey;
    }
}
declare module dotNeTS {
    interface IOrderedEnumerable<TSource> extends IEnumerable<TSource> {
        OrderBy<TKey>(keySelector: IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
        OrderByDecending<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource>;
        ThenBy<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource>;
        ThenByDecending<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource>;
    }
}
declare module dotNeTS {
    interface ISortExpression<TSource> {
        sortOrder: SortOrder;
        expression: IFunc<TSource, any>;
    }
}
declare module dotNeTS {
    class OrderedEnumerable<TSource> extends Enumerable<TSource> implements IOrderedEnumerable<TSource> {
        constructor(parent: Enumerable<TSource>);
        private sortExpressions;
        public getEvaluatedCollection(): TSource[];
        private AddLazyOrderInternal<TKey>(callback, sortOrder);
        public OrderBy<TKey>(keySelector: IFunc<TSource, TKey>): IOrderedEnumerable<TSource>;
        public OrderByDecending<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource>;
        public ThenBy<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource>;
        public ThenByDecending<TSort>(callback: IFunc<TSource, TSort>): IOrderedEnumerable<TSource>;
        private EvaluateOrderBy();
        public Dispose(): void;
    }
}
declare module dotNeTS {
    enum SortOrder {
        ASC = 0,
        DESC = 1,
    }
}
declare module dotNeTS {
    class ArgumentOutOfRangeException extends Exception {
        constructor(message: string);
    }
}
declare module dotNeTS {
    interface IDisposable {
        Dispose(): void;
    }
}
declare module dotNeTS {
    interface IFunc<T, TResult> {
        (value: T, index: number, list: T[]): TResult;
    }
    interface IFunc<T, TResult> {
        (value: T, value2: T, index: number, list: T[]): TResult;
    }
    interface IFunc<T, TResult> {
        (value: T, index: number, list: T[]): TResult;
    }
    interface IComparer<T, TResult> {
        (newValue: T, oldvalue: T, index: number, list: T[]): TResult;
    }
}
declare module dotNeTS {
    class InvalidOperationException extends Exception {
        constructor(message: string);
    }
}
