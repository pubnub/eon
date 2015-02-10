var eon = function(data) {

  var Eon = function(options) {

    var self = this;
    var error = false;

    c3 = c3;
    self.chart = false;

    self.pubnub = PUBNUB || false;

    options.subscribe_key = options.subscribe_key || "demo";
    options.channel = options.channel || false;
    options.generate = options.generate || {};
    options.flow = options.flow || false;

    if(!options.channel) {
      error = "No channel supplied.";
    }

    if(!self.pubnub) {
      error = "PubNub not found!";
    }        

    var boot = function() {

      self.chart = c3.generate(options.generate);

      var pubnub = PUBNUB.init({
        publish_key: 'demo',
        subscribe_key: 'demo'
      });

      self.pubnub.subscribe({
        channel: options.channel,
        message: function(m) {

          if(options.flow) {  

            // this disables all other functionality, fix
            // as it only changed columns
            options.flow.columns = m.columns;
            self.chart.flow(options.flow);

          } else {
            self.chart.load(m); 
          }
          
        }
      });

      return self;

    }

    if(error) {
      console.error("EON: " + error);
    } else {
      boot();
    }
     
  }

  return new Eon(data);

};