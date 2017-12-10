# run process for the cluster
# running on a single dev machine as a demo...
# mkdir /mongodb
# chown mongodb.mongodb /mongodb
cd /mongodb/

mkdir a0
mkdir a1
mkdir a2
mkdir b0
mkdir b1
mkdir b2
mkdir c0
mkdir c1
mkdir c2
mkdir d0
mkdir d1
mkdir d2

mkdir cfg0
mkdir cfg1
mkdir cfg2

#--configsvrMode=sccc
# config servers
mongod --configsvr --dbpath cfg0 --port 26050 --replSet conf --fork --logpath log.cfg0 --logappend
mongod --configsvr --dbpath cfg1 --port 26051 --replSet conf --fork --logpath log.cfg1 --logappend
mongod --configsvr --dbpath cfg2 --port 26052 --replSet conf --fork --logpath log.cfg2 --logappend

# "shard servers" (mongod data servers)
# note: don't use small files nor such a small oplogSize in production; these are here as we are running many on one 
mongod --shardsvr --replSet a --dbpath a0 --logpath log.a0 --port 27000 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet a --dbpath a1 --logpath log.a1 --port 27001 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet a --dbpath a2 --logpath log.a2 --port 27002 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet b --dbpath b0 --logpath log.b0 --port 27100 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet b --dbpath b1 --logpath log.b1 --port 27101 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet b --dbpath b2 --logpath log.b2 --port 27102 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet c --dbpath c0 --logpath log.c0 --port 27200 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet c --dbpath c1 --logpath log.c1 --port 27201 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet c --dbpath c2 --logpath log.c2 --port 27202 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet d --dbpath d0 --logpath log.d0 --port 27300 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet d --dbpath d1 --logpath log.d1 --port 27301 --fork --logappend --smallfiles --oplogSize 50
mongod --shardsvr --replSet d --dbpath d2 --logpath log.d2 --port 27302 --fork --logappend --smallfiles --oplogSize 50


mongo --port 26050 --eval '
rs.initiate(
  {
    _id: "conf",
    configsvr: true,
    members: [
      { _id : 0, host : "localhost:26050" },
      { _id : 1, host : "localhost:26051" },
      { _id : 2, host : "localhost:26052" }
    ]
  }
)
'

#mongos porcesses
mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath log.mongos0 
mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath log.mongos0 --port 26061
mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath log.mongos0 --port 26062
mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath log.mongos0 --port 26063

mongo  --port 26050  --eval 'rs.status()'

ps aux | grep mongo
