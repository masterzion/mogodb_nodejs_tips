db.zips.aggregate(
[
	{ 
        $sort : { 
            state : 1,
            city : 1
        } 
    }
	
]);


-------------

db.zips.aggregate(
[
	{ 
        $match : { 
            pop : {"$gt" : 100000}
        } 
    }
	
]);

-------------
db.zips.aggregate(
[
	{ 
    $project : { 
        _id  : 0,
        city : {"$toLower" :"$city"},
        pop : 1,
        state :1,
        zip : "$_id"
        } 
    }
	
]);
-----------

db.messages.aggregate(
[
	{ $project : { "headers.From" :1 , "headers.To" :1 } },
	{ $unwind : "$headers.To" },
	{ "$group" : {
			"_id": { "F": "$headers.From", "T" : "$headers.To" },
			count:  {"$sum": 1 }
		} 
	},
	{ $sort: {"count": -1} },
	{ $limit: 3 } 
]);
---------------------


db.posts.aggregate(
[
	{ $project : { "comments.author" :1 , _id : 0 } },
	{ $unwind : "$comments" },
	{ "$group" : {
			"_id":  "$comments.author" ,
			count:  {"$sum": 1 }
		} 
	},
	{  $sort : {  count : -1 } },
	{ $limit: 3 } 
]);

---------------------

db.zips.aggregate([ 
    {$match: 
        {state : {"$in" : ["NY","CA"]  }} 
    },
    { $group: 
        { _id : {city:"$city", state:"$state"}, 
        population : { $sum : "$pop"} } 
    },  
    { $match:
        {"population" : {$gt: 25000}} 
    },
    { $group: 
        {_id:"total", "average":{$avg:"$population"}} 
    }
])

------


db.grades.aggregate([
    { $unwind : "$scores" },
    { $match : 
        { "scores.type" : {$ne: "quiz"}}
    },
    { $group: 
        { _id : 
            { student_id : "$student_id",
            class_id : "$class_id"
            },
        "average" :
            {$avg:"$scores.score"}
        }
    },
    { $group:
        {_id: "$_id.class_id", "avg": {$avg: "$average"}}
    },
    { $sort:  {avg : -1} } ,
    { $limit : 1 }
    
])
-------------------

db.zips.aggregate([
    { $project: 
        { first_char: 
            {$substr : ["$city",0,1]}, 
            pop : "$pop"
        }
    }, 
    { $match:
        { "first_char": 
            {$in: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }
        }
    }, 
    { $group: 
        {_id:null,
        tot_pop:{ $sum: "$pop"}
        }
    }
])



-------------

db.zips.aggregate(
[
	{ $project : { "state" :1  } },
	{ "$group" : {
			"_id":  "$state" ,
			count:  {"$sum": 1 }
		} 
	},
	{  $sort : {  count : -1 } },
	{ $limit: 5 } 
]);

-------------

db.zips.aggregate([

    { $project: 
        { first_char: 
            {$substr : ["$city",0,1]}
        }
    }, 
    { $match:
        { "first_char": 
            {$in: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] }
        }
    }, 
    { $group: 
        {_id:null,
        count:{ $sum: 1}
        }
    }
]);


