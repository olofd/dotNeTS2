module dotNeTS {
    export class EnumerableExpressionDefenitions<TSource> {

        static ExcecuteExpression<TSource>(array: TSource[], exp: IExpressionFunc): TSource[] {

            switch (exp.type) {
                case IExpressionType.Where:
                    return EnumerableExpressionDefenitions.Where(array, exp.func);
            }

            return null;
        }

        static Where<TSource>(array: TSource[], exp: IFunc<TSource, boolean>) : TSource[] {
            return _.where(array, exp);
        }
    }
}