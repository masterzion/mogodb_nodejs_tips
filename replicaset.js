// execute these commandlines
// -----------------------------
// $killall mongod
// $rm -rf 1 2 3 1.log 2.log 3.log
// $mkdir 1 2 3

// $mongod --dbpath 1 --port 27001 --smallfiles --oplogSize 50 --logpath 1.log --logappend --fork
// $mongod --dbpath 2 --port 27001 --smallfiles --oplogSize 50 --logpath 2.log --logappend --fork
// $mongod --dbpath 3 --port 27001 --smallfiles --oplogSize 50 --logpath 3.log --logappend --fork
// $mongo --port 27001 --shell week4.js



// ======= 4.1   ======= 
homework.init()
homework.a() // <<< RESULT
exit



// ======= 4.2   ======= 
// $killall mongod
// -------------------------------


// $mongod --replSet teste --dbpath 1 --port 27001 --oplogSize 50 --smallfiles --logpath 1.log --logappend --fork
// $mongo --port 27001 --shell week4.js
cfg = {
    _id: "teste",
    members: [
        {
            _id: 0,
            host: "localhost:27001"
        }
 ]
}
rs.initiate(cfg)
rs.status()
use week4
db.foo.find()
homework.b() // <<< RESULT

// ======= 4.3   ======= 
// -------------------------------
// $mongod --replSet teste --dbpath 2 --port 27002 --oplogSize 50 --smallfiles --logpath 2.log --logappend --fork
// $mongod --replSet teste --dbpath 3 --port 27003 --oplogSize 50 --smallfiles --logpath 3.log --logappend --fork


cfg2 = {
    _id: "teste",
    members: [
        {
            _id: 0,
            host: "localhost:27001"
        },
        {
            _id: 1,
            host: "localhost:27002"
        },
        {
            _id: 2,
            host: "localhost:27003"
        }
 ]
}
 rs.reconfig(cfg2)
 rs.status()
 homework.c() // <<< RESULT
 
// ======= 4.4   ======= 
  
 rs.stepDown(300)
 exit
 
 // kill PID_PROCESS_PORT_27001
 // $mongo --port 27002 --shell week4.6caf9de7cde4.js
 
  
 cfg3 = {
    _id: "teste",
    members: [
        {
            _id: 1,
            host: "localhost:27002"
        },
        {
            _id: 2,
            host: "localhost:27003"
        }
 ]
}
rs.reconfig(cfg3)
rs.status()
homework.d() // <<< RESULT
exit
// ======= 4.5   ======= 
//  $mongo --port 27003 --shell week4.6caf9de7cde4.js
db.isMaster().ismaster
use local
db.oplog.rs.find()
db.oplog.rs.stats()
db.oplog.rs.find().sort({$natural:1}).limit(1).next().o.msg[0] // <<< RESULT
