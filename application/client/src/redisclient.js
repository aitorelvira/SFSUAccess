const redis = require('redis');

var redisclient = redis.createClient();
redisclient.on('connect', function() {
  console.log('Redis client connected');
});

redisclient.on('error', function(err) {
  console.log('Something went wrong' + err);
})

redisclient.set('numLogins', 0, function(err, reply) {
  console.log('Site Visits: ' + reply);
});

module.exports = redisclient;