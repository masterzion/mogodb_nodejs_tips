
//========== 1  ========== 

// $killall mongod
// $rm -rf data/
// $rm -rf *.log
// $./a.c7527cdb3804.sh 
// $mongo --shell --port 27003 a.aa6513503fc9.js
ourinit()
rs.stepDown()
rs.freeze()
testRollback()

// $ps -A | grep mongod
rs.slaveOk()
db.foo.find()  <<< RESP


//========== 2  ========== 
// $mongod --fork --logpath a.log --smallfiles --oplogSize 50 --port 27001 --dbpath data/z1 --replSet z
// $mongod --fork --logpath b.log --smallfiles --oplogSize 50 --port 27002 --dbpath data/z2 --replSet z

testRollback()

// $killall mongod
// $ps -lAf | grep mongod
// $mongo --shell --port 27001

db.foo.find()
db.foo.insert({_id:"last"})
db.getLastErrorObj(2)

// $mongod --fork --logpath c.log --smallfiles --oplogSize 50 --port 27003 --dbpath data/z3 --replSet z

db.foo.find() <<< RESP


//========== 3  ========== 
// "Mongo preserves the order of writes in a collection in its consistency model. In this problem, 27003's oplog was effectively a "fork" and to preserve write ordering a rollback was necessary during 27003's recovery phase."  <<<< RESP



// $ls -la data/z3/rollback/
// $bsondump data/z3/rollback/test.foo.2014-01-23T04-52-03.0.bson  <<<< RESP


//========== 4  ========== 
// $mongo --shell --port 27001 a.aa6513503fc9.js 

cfg = rs.conf();
cfg.members[2].priority = 0;
rs.reconfig(cfg);

part4()  <<<< RESP

//========== 5  ========== 
// We can create an index to make the query fast/faster: <<<< RESP
// One way to assure people vote at most once per posting is to use this form of update: <<<< RESP



//========== 6  ========== 
// MongoDB supports atomic operations on individual documents. <<<< RESP
// MongoDB has a data type for Dates and DateTime data. <<<< RESP


//========== 7  ========== 
// MongoDB supports reads from slaves/secondaries that are in remote locations. <<<< RESP



//========== 8  ========== 
// $mkdir temp
// $cd temp/
// $mkdir config
// $mongorestore --dbpath config ../server/config_server/
// $mongod --configsvr --dbpath config
// $mongo localhost:27019/config
db.chunks.find().sort({_id:1}).next().lastmodEpoch.getTimestamp().toUTCString().substr(20,6)
//07:07 <<<< RESP




//========== 9  ========== 
// $mkdir 1
// $mongorestore --dbpath 1 --oplogReplay ../server/s1/
// $mkdir 2
// $mongorestore --dbpath 2 --oplogReplay ../server/s2/
// $mongo localhost:27019
use config
db.shards.find();
db.shards.update({ "_id" : "s1"}, {"host" : "localhost:27501" });
db.shards.update({ "_id" : "s2"}, {"host" : "localhost:27601" });
db.shards.find()
// $killall mongod
// $mongod --configsvr --dbpath config  --logpath configsrv.log --fork
// $mongod --shardsvr --dbpath 1 --port 27501 --logpath 1.log --fork
// $mongod --shardsvr --dbpath 2 --port 27601 --logpath 2.log --fork

sh.stopBalancer()
// $mongos --configdb  localhost:27019 --upgrade
sh.startBalancer()

use snps
db.elegans.ensureIndex({N2:1,mutant:1}) 
db.elegans.aggregate([{$match:{N2:"T"}},{$group:{_id:"$N2",n:{$sum:1}}}]).result[0].n <<<< RESP


//========== 10  ========== 
db.elegans.find({N2:"T",mutant:"A"}).limit(5).explain()
// 2 shards are queried. <<<< RESP
// 10 documents are scanned. <<<< RESP



//========== 11  ========== 
// $mongoimport -d snps -c problem11 problem11.json
db.problem11.aggregate(
{
	$group : {
			_id:{n2 : "$N2" , mutant : "$mutant"}, 
			count : {$sum:1}
		}
}).result.length  <<<< RESP

