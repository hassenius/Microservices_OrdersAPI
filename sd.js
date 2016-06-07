var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();


// Service Discovery Configurations
var ttl = 300;
var serviceName = "Orders";
var serviceHost = appEnv.bind;
var servicePort = "http"
var serviceUrl = appEnv.url

var ServiceDiscovery = require('bluemix-service-discovery');
var discovery = new ServiceDiscovery({ name: 'myServiceDiscovery', version: 1 });

// register a service and send heartbeats
discovery.register({
  "service_name": serviceName,
  "ttl": ttl,
  "status": "UP",
  "endpoint": {
    "type": servicePort,
    "value": serviceHost
    //"host": serviceHost,
    //"port": servicePort
  },
  "metadata": {"url": serviceUrl }
}, function(error, response, service) {
  if (!error) {
    var intervalId = setInterval(function() {
      discovery.renew(service.id, function(error, response, service) {
        if (error || response.statusCode !== 200) {
          console.log('Could not send heartbeat');
          clearInterval(intervalId);
        }
      });
    }, ttl * 1000 * 0.75);
  }
});
