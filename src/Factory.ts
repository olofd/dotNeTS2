module dotNeTS {
    export function createList<T>(startArray?: T[]): dotNeTS.List<T> {
        return new dotNeTS.List<T>(startArray);
    }
} 