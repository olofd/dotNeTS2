'use strict';
var getTimestamp, timesToRunTimeTests = 1;
if (window.performance.now) {
    getTimestamp = function () { return window.performance.now(); };
}
var timeWatch = function (operation, numberOfTimes, name?) {
    var t1 = getTimestamp(), res;
    for (var i = 0; i < numberOfTimes; i ++) {
        operation();
    }
    var t2 = getTimestamp();

    console.log("Time Operation: " + name + " ::  " + (t2 - t1));
}
var List = dotNeTS.List;

interface IHarvestInfo {
    Region: number;
    Region_name: string;
    MCode: number;
    MName: string;
    Year: number;
    Product: string;
    Quantity: number;
    Category: string;
    Unit: string;
}
interface Window {
    getTestData() : Array<IHarvestInfo>;
}
interface IAddress {
    street : string;
}
interface IUser {
    id: number;
    userName: string;
    firstName: string;
    lastName: string;
    age: number;
    family?: Array<IUser>;
    address?: IAddress;
}
function GetUser(): IUser {
    return GetUsers()[0];
}

function GetUsers(): IUser[] {
    var userOne: IUser = {
        id: 1,
        userName: "olofd",
        firstName: "Olof",
        lastName: "Dahlbom",
        age: 28,
        family: [
            {
                id: 4,
                userName: "jd",
                firstName: "janne",
                lastName: "dahlbom",
                age: 56,


            }
        ],
        address: {
            street: "robbenarve"
        }
    };

    var userTwo: IUser = {
        id: 2,
        userName: "mange",
        firstName: "Magnus",
        lastName: "Farje",
        age: 28,
        family: [{
            id: 4,
            userName: "jd",
            firstName: "janne",
            lastName: "dahlbom",
            age: 56,
        }],
        address: {
            street: "robbenarve"
        }
    };

    var userThree: IUser = {
        id: 3,
        userName: "ludde",
        firstName: "Ludvig",
        lastName: "enstrom",
        age: 26,
        family: [{
            id: 4,
            userName: "tk",
            firstName: "tomas",
            lastName: "nilsson",
            age: 49,
        }],
        address: {
            street: "lingonvagen"
        }
    };

    return [userOne, userTwo, userThree];
}

describe('Test of List-implementation', function () {
    var getFilledList = function () {
        var users = GetUsers();
        var list = new List<IUser>();
        list.Add(users[0]);
        list.Add(users[1]);
        list.Add(users[2]);
        return list;
    };
    var getFilledHarvestList = function () {
        var users = window.getTestData();
        var list = new List<IHarvestInfo>(users);
        return list;
    };
    it('Test accessability', function () {
        expect(dotNeTS.createList).toBeDefined();
        var list = dotNeTS.createList();

        expect(list).toBeDefined();
        expect(dotNeTS).toBeDefined();
        var list = new List();
        expect(list).toBeDefined();
    });
    it('Should be able to get test data', function () {
        expect(GetUsers().length).toBe(3);
        expect(GetUser()).toBeDefined();
    });
    it('Add defined', function () {
        var list = new List<IUser>();
        expect(list.Add).toBeDefined();
    });
    it('Add one', function () {
        var testUser = GetUser();
        var list = new List<IUser>();
        expect(list.Add).toBeDefined();
        list.Add(testUser);
        expect(list.innerArray.length).toBe(1);

    });
    it('Add two', function () {
        var testUser = GetUser();
        var list = new List<IUser>();
        list.Add(testUser);
        list.Add(testUser);
        expect(list.innerArray.length).toBe(2);

    });

    it('Add constructor', function () {
        var users = GetUsers();
        var list = new List<IUser>(users);
        expect(list.innerArray.length).toBe(3);
    });
    it('Add one Remove one', function () {
        var testUser = GetUser();
        var list = new List<IUser>();
        expect(list.Add).toBeDefined();
        list.Add(testUser);
        expect(list.innerArray.length).toBe(1);
        list.Remove(testUser);
        expect(list.innerArray.length).toBe(0);
    });
    it('Add range', function () {
        var testUser = GetUser();
        var list = new List<IUser>();
        list.Add(testUser);
        list.Add(testUser);
        list.AddRange(getFilledList());
        expect(list.innerArray.length).toBe(5);

    });
    it('Dispose List', function () {
        var testUser = GetUser();
        var list = new List<IUser>();
        list.Add(testUser);
        list.Add(testUser);
        list.AddRange(getFilledList());
        expect(list.innerArray.length).toBe(5);
        list.Dispose();
        expect(list.innerArray.length).toBe(0);

    });

    it('Count three elements and one with predicate', function () {
        var list = getFilledList();
        expect(list.Count()).toBe(3);
        expect(list.Count(b => b.id === 1)).toBe(1);
    });
    it('Where age is 28', function () {
        var list = getFilledList();
        var newList = list.Where(b=> b.age === 28);
        expect(list.Count()).toBe(3);
        expect(newList).toBeDefined();
        expect(newList.Count()).toBe(2);

    });
    it('Where id is greater then 1', function () {
        var list = getFilledList();
        var newList = list.Where(b=> b.id > 1);
        expect(list.Count()).toBe(3);
        expect(newList).toBeDefined();
        expect(newList.Count()).toBe(2);
    });
    it('FirstOrDefault without predicate', function () {
        var list = getFilledList();
        var user = list.FirstOrDefault();
        expect(user).toBeDefined();
        expect(user.id).toBe(1);
        list = new List<IUser>();
        expect(list.FirstOrDefault()).toBe(null);
    });
    it('FirstOrDefault with predicate', function () {
        var list = getFilledList();
        var user = list.FirstOrDefault(b => b.userName === "ludde");
        expect(user).toBeDefined();
        expect(user.userName).toBe("ludde");
        user = list.FirstOrDefault(b=> b.userName === "kalle");
        expect(user).toBe(null);

    });
    it('First without predicate', function () {
        var list = getFilledList();
        var user = list.First();
        expect(user).toBeDefined();
        expect(user.id).toBe(1);
    });
    it('First all exceptions', function () {
        var list = new List<IUser>();
        expect(function () {
            list.First();
        }).toThrow("Sequence contains no elements");

        var list = new List<IUser>();
        list.Add(GetUser());
        expect(function () {
            list.First(b => b.userName === "olof");
        }).toThrow("Sequence contains no matching element");
    });

    it('First with predicate', function () {
        var list = getFilledList();
        var user = list.First(b => b.userName === "ludde");
        expect(user).toBeDefined();
        expect(user.userName).toBe("ludde");
        expect(function () {
            list.First(b => b.userName === "kalle");
        }).toThrow();
    });
    it('Single without predicate', function () {
        var users = new List<IUser>([GetUser()]);
        var user = users.Single();
        expect(user).toBeDefined();
        var list = getFilledList();
        expect(function () { list.Single(); }).toThrow();
    });
    it('Single with predicate', function () {
        var list = getFilledList();
        var user = list.Single(b => b.userName === "ludde");
        expect(user).toBeDefined();
        expect(user.userName).toBe("ludde");
        expect(function () {
            list.Single(b => b.age === 28);
        }).toThrow();
    });

    it('Select one element', function () {
        var list = getFilledList();
        var newUsers = list.Select(b=> <IUser>{ id: ++b.id, userName: b.userName });
        var fistUser = newUsers.FirstOrDefault();
        expect(fistUser.id).toBe(2);
        expect(fistUser.age).toBeUndefined();
    });
    it('Contains', function () {
        var list = getFilledList();
        expect(list.Contains).toBeDefined();
        expect(list.Contains(list.FirstOrDefault())).toBeTruthy();
        expect(list.Contains(<IUser>{})).toBeFalsy();
    });
    it('ForEack', function () {
        var list = getFilledList();
        expect(list.ForEach).toBeDefined();
        list.ForEach((user, index, collection) => {
            expect(user).toBeDefined();
            expect(index).toBeDefined();
            expect(collection).toBeDefined();
        });
    });
    it('OrderBy', function () {
        var list = getFilledList();
        expect(list.OrderBy).toBeDefined();

        //OrderBy
        var orderTestList = list.OrderBy(b => b.age);
        expect(orderTestList.First().age).toBe(26);

        //OrderByDecending
        orderTestList = list.OrderByDecending(b => b.age);
        expect(orderTestList.First().age).toBe(28);

        //ThenBy
        var newOrderedList = orderTestList.ThenBy(b => b.firstName);
        expect(newOrderedList.First().firstName).toBe("Magnus");

        //ThenByDecending
        orderTestList = orderTestList.ThenByDecending(b => b.firstName);
        expect(orderTestList.First().firstName).toBe("Olof");

    });
    it('Test OrderBy after expressions', function () {

        var testUser = GetUser();
        var list = new List<IUser>();
        list.Add(testUser);
        list.Add(testUser);
        list.AddRange(getFilledList());
        var newList = list.Where(b => b.age > 27);
        var ordered = newList.OrderBy(b => b.age);
        expect(ordered.FirstOrDefault().age).toBe(28);


    });

    it('ElementAt', function () {
        var list = getFilledList();
        expect(list.ElementAt).toBeDefined();
        expect(list.ElementAtOrDefault).toBeDefined();
        expect(list.ElementAt(0)).toBeDefined();
        expect(list.ElementAt(2)).toBeDefined();
        expect(function () {
            list.ElementAt(3);
        }).toThrow("Index was out of range. Must be non-negative and less than the size of the collection.");

    });

    it('Update', function () { 
        var list = getFilledList();

        list.ReplaceWith((<IUser>{
            id: 1,
            userName: "maria",
            firstName: "Maria",
            lastName: "Fredriksson",
            age: 32
        }), (newVal, oldVal) => newVal.id === oldVal.id);
        var idOne = list.FirstOrDefault(b => b.id === 1).userName;
        expect(idOne).toBe('maria');

    });

    it('Insert', function () {
        var list = getFilledList();
        var element = getFilledList().ElementAt(2);
        list.Insert(0, element);
        expect(list.ElementAt(0).id).toBe(3);
        expect(list.ElementAt(1).id).toBe(1);
        expect(list.Count()).toBe(4);
    });
    it('Aggregate odd', function () {
        var list = getFilledList();
        var a = list.Select(b => b.firstName).Aggregate((current, next) => current + ", " + next);
        console.log(a);
    });
    it('Aggregate even', function () {
        var list = getFilledList();
        list.Add(getFilledList().FirstOrDefault());
        var a = list.Select(b => b.firstName).Aggregate((current, next) => current + ", " + next);
        console.log(a);
    });
    it('Aggregate one', function () {
        var list = dotNeTS.createList([getFilledList().FirstOrDefault()]);
        var a = list.Select(b => b.firstName).Aggregate((current, next) => current + ", " + next);
        console.log(a);
    });
    it('SelectMany', function () {
        var list = getFilledList();
        var a = list.SelectMany(b => b.family);
        expect(a.Count()).toBe(3);

    });
    it('GroupBy -> SelectMany', function () {
        var list = getFilledList().GroupBy(b => b.age);
        var a = list.SelectMany(b => b.ToArray());
        expect(a.Count()).toBe(3);

    });
    it('Sum', function () {
        var list = getFilledList();
        var a = list.Sum(b => b.age);
        expect(a).toBe(82);

    });
    it('Sum without callback', function () {
        var list = dotNeTS.createList<number>([0, 1, 2, 4]);
        var newList = list.OrderByDecending(b => b);
        var a = newList.Sum();
        expect(a).toBe(7);

    });
    it('Sum with null', function () {
        var list = dotNeTS.createList<number>([0, null, 2, 4]);
        var newList = list.OrderByDecending(b => b);
        var a = newList.Sum();
        expect(a).toBe(6);

    });
    it('Sum with undefined', function () {
        var list = dotNeTS.createList<number>([0, undefined, 2, 4]);
        var newList = list.OrderByDecending(b => b);
        var a = newList.Sum();
        expect(a).toBe(6);

    });
    it('Min with callback', function () {
        var list = getFilledList();
        var a = list.Min(b => b.age);
        expect(a).toBe(26);

    });
    it('Min without undefined', function () {
        var list = dotNeTS.createList<number>([9, 5, 2, 4]);
        var a = list.Min();
        expect(a).toBe(2);
    });
    it('Min with undefined', function () {
        var list = dotNeTS.createList<number>([1,undefined, 2, 4]);
        var a = list.Min();
        expect(a).toBe(1);
    });
    it('Max with callback', function () {
        var list = getFilledList();
        var a = list.Max(b => b.age);
        expect(a).toBe(28);

    });
    it('Max without undefined', function () {
        var list = dotNeTS.createList<number>([9, 5, 2, 4]);
        var a = list.Max();
        expect(a).toBe(9);
    });
    it('Max with undefined', function () {
        var list = dotNeTS.createList<number>([1, undefined, 2, 4]);
        var a = list.Max();
        expect(a).toBe(4);
    });
    //it('Group By With String', function () {
    //    timeWatch(function () {
    //        var harvestData = getFilledHarvestList();
    //        var grouping = harvestData.GroupBy(b => b.MName);
    //        var firstGroup = grouping.Where(b => b.Key === 'Upplands Väsby').FirstOrDefault();
    //        expect(firstGroup.Count()).toBe(152);
    //    }, timesToRunTimeTests,'Group By With String');
    //});
    //it('Group By String (optimized)', function () {
    //    timeWatch(function () {
    //        var harvestData = getFilledHarvestList();
    //        var grouping = harvestData.GroupByStringKey(b => b.MName);
    //        var firstGroup = grouping.Where(b => b.Key === 'Upplands Väsby').FirstOrDefault();
    //        expect(firstGroup.Count()).toBe(152);
    //    }, timesToRunTimeTests,'Group By String (optimized)');
    //});
    //it('Group By With Number', function () {
    //    timeWatch(function () {
    //        var harvestData = getFilledHarvestList();
    //        var grouping = harvestData.GroupBy(b => b.MCode);
    //        var firstGroup = grouping.Where(b => b.Key === 114).FirstOrDefault();
    //        expect(firstGroup.Count()).toBe(152);
    //    }, timesToRunTimeTests,'Group By With Number');

    //});

    //it('Group By Number (optimized)', function () {
    //    timeWatch(function () {
    //        var harvestData = getFilledHarvestList();
    //        var grouping = harvestData.GroupByNumberKey(b => b.MCode);
    //        var firstGroup = grouping.Where(b => b.Key === 114).FirstOrDefault();
    //        expect(firstGroup.Count()).toBe(152);
    //    }, timesToRunTimeTests,'Group By Number (optimized)');
    //});

    //it('Group By object', function () {
    //    var list = getFilledHarvestList();
    //    var grouping = list.GroupBy((harvest) => {
    //        return {
    //            MyName: harvest.MName,
    //            QInfo: {
    //                Q: harvest.Quantity
    //            }
    //        }
    //    });
    //    expect(grouping.Count()).toBe(290);


    //    //var grouping2 = list.GroupBy((harvest) => {
    //    //    return {
    //    //        MyName: harvest.MName,
    //    //        QInfo: {
    //    //            Q: harvest.Quantity
    //    //        }
    //    //    }
    //    //});

    //});


});
