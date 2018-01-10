# run process for the cluster

#install packages in ami image
sudo echo "[mongodb-enterprise]" > /etc/yum.repos.d/mongodb-enterprise.repo
sudo echo "name=MongoDB Enterprise Repository" >> /etc/yum.repos.d/mongodb-enterprise.repo
sudo echo "baseurl=https://repo.mongodb.com/yum/amazon/2013.03/mongodb-enterprise/3.6/$basearch/" >> /etc/yum.repos.d/mongodb-enterprise.repo
sudo echo "gpgcheck=1" >> /etc/yum.repos.d/mongodb-enterprise.repo
sudo echo "enabled=1" >> /etc/yum.repos.d/mongodb-enterprise.repo
sudo echo "gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc" >> /etc/yum.repos.d/mongodb-enterprise.repo

sudo yum install -y mongodb-enterprise-3.6.1 mongodb-enterprise-server-3.6.1 mongodb-enterprise-shell-3.6.1 mongodb-enterprise-mongos-3.6.1 mongodb-enterprise-tools-3.6.1

# running on a single dev machine as a demo...
sudo mkdir /mongodb
sudo mkdir /mongodb/a0
sudo mkdir /mongodb/a1
sudo mkdir /mongodb/a2
sudo mkdir /mongodb/b0
sudo mkdir /mongodb/b1
sudo mkdir /mongodb/b2
sudo mkdir /mongodb/c0
sudo mkdir /mongodb/c1
sudo mkdir /mongodb/c2
sudo mkdir /mongodb/d0
sudo mkdir /mongodb/d1
sudo mkdir /mongodb/d2

sudo mkdir /mongodb/cfg0
sudo mkdir /mongodb/cfg1
sudo mkdir /mongodb/cfg2

sudo chown -R mongod.mongod /mongodb/
sudo chmod -R 770  /mongodb/

#--configsvrMode=sccc
# config servers
sudo -u mongod mongod --configsvr --dbpath /mongodb/cfg0 --port 26050 --replSet conf --fork --logpath /mongodb/log.cfg0 --logappend
sudo -u mongod mongod --configsvr --dbpath /mongodb/cfg1 --port 26051 --replSet conf --fork --logpath /mongodb/log.cfg1 --logappend
sudo -u mongod mongod --configsvr --dbpath /mongodb/cfg2 --port 26052 --replSet conf --fork --logpath /mongodb/log.cfg2 --logappend

# "shard servers" (mongod data servers)
# note: don't use small files nor such a small oplogSize in production; these are here as we are running many on one 
sudo -u mongod mongod --shardsvr --replSet a --dbpath /mongodb/a0 --logpath /mongodb/log.a0 --port 27000 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet a --dbpath /mongodb/a1 --logpath /mongodb/log.a1 --port 27001 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet a --dbpath /mongodb/a2 --logpath /mongodb/log.a2 --port 27002 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet b --dbpath /mongodb/b0 --logpath /mongodb/log.b0 --port 27100 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet b --dbpath /mongodb/b1 --logpath /mongodb/log.b1 --port 27101 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet b --dbpath /mongodb/b2 --logpath /mongodb/log.b2 --port 27102 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet c --dbpath /mongodb/c0 --logpath /mongodb/log.c0 --port 27200 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet c --dbpath /mongodb/c1 --logpath /mongodb/log.c1 --port 27201 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet c --dbpath /mongodb/c2 --logpath /mongodb/log.c2 --port 27202 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet d --dbpath /mongodb/d0 --logpath /mongodb/log.d0 --port 27300 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet d --dbpath /mongodb/d1 --logpath /mongodb/log.d1 --port 27301 --fork --logappend --smallfiles --oplogSize 50
sudo -u mongod mongod --shardsvr --replSet d --dbpath /mongodb/d2 --logpath /mongodb/log.d2 --port 27302 --fork --logappend --smallfiles --oplogSize 50


sudo -u mongod mongo --port 26050 --eval '
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
sudo -u mongod mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath /mongodb/log.mongos0 
sudo -u mongod mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath /mongodb/log.mongos0 --port 26061
sudo -u mongod mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath /mongodb/log.mongos0 --port 26062
sudo -u mongod mongos --configdb "conf/localhost:26050,localhost:26051,localhost:26052" --fork --logappend --logpath /mongodb/log.mongos0 --port 26063

sudo -u mongod mongo  --port 26050  --eval 'rs.status()'

sudo -u mongod ps aux | grep mongo

