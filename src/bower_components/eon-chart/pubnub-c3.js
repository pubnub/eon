var eon = eon || {};
eon.c = {
  observers: {},
  message: function(message, env, channel) {

    for(var i in eon.c.observers[channel]) {
      eon.c.observers[channel][i](message, env, channel);
    }

  },
  subscribe: function(pubnub, channel, connect, callback) {

    if(typeof(eon.c.observers[channel]) == "undefined") {

      eon.c.observers[channel] = [callback];

      pubnub.subscribe({
        channel: channel,
        connect: connect,
        message: function(message, env, channel) {
          eon.c.message(message, env, channel);
        }
      });

    } else {
      eon.c.observers[channel].push(callback);
    }

  },
  create: function(options) {

    if(typeof(PUBNUB) == "undefined" && console) {
      console.error("PubNub not found. See http://www.pubnub.com/docs/javascript/javascript-sdk.html#_where_do_i_get_the_code");
    }

    var self = this;
    var error = false;

    c3 = c3;
    self.chart = false;

    self.pubnub = PUBNUB || false;

    if(!self.pubnub) {
      error = "PubNub not found!";
    }

    options.subscribe_key = options.subscribe_key || eon.subscribe_key || 'demo';
    options.channel = options.channel || false;
    options.generate = options.generate || {};
    options.flow = options.flow || false;
    options.flow.length = options.flow.length || 0;
    options.limit = options.limit || 10;
    options.rate = options.rate || 500; // refresh rate
    options.history = options.history || false;

    options.message = options.message || function(){};
    options.connect = options.connect || function(){};

    if(options.limit > 100) {
      options.limit = 100;
    }

    if(!options.channel) {
      error = "No channel supplied.";
    }

    var page = function() {

      all_messages = [];

      getAllMessages = function(timetoken) {
         self.pubnub.history({
          count: options.limit,
          channel: options.channel,
          start: timetoken,
           callback: function(payload) {

             var msgs = payload[0];
             var start = payload[1];
             var end = payload[2];

             if (msgs !== undefined && msgs.length) {

               msgs.reverse();

               i = 0;
               while(i < msgs.length) {
                 all_messages.push(msgs[[i]]);
                 i++;
               }

             }

             if (msgs.length && all_messages.length < options.limit) {
               getAllMessages(start);
             } else {

                var data = [];

               i = 0;
               while(i < all_messages.length) {

                var columns = all_messages[i].columns;

                 for(var j in columns) {

                    if(i == 0) {
                      data[j] = [];
                      data[j].push(columns[j][0]);
                    }

                    data[j].push(columns[j][1]);

                 }

                 i++;

               }

               // ready to go
               data.reverse();
               self.chart.load({columns: data});

             }

           }
         });
       };

       getAllMessages();

    };

    var needsTrim = function() {

      var buffer = self.chart.data();

      for(i in buffer) {
        if(buffer[i].values.length > options.limit) {
          return buffer[i].values.length - options.limit;
          break;
        }
      }

      return false;

    };

    var message_buffer = [];

    var renderNext = function() {

      if(message_buffer.length) {

        var m = message_buffer[0];
        message_buffer.shift();

        if(options.flow) {

          if(options.flow === true) {
            options.flow = {};
          }

          var trimLength = needsTrim();

          if(trimLength)  {
            options.flow.length = trimLength;
          }

          options.flow.columns = m.columns;
          options.flow.done = function(){

            if(message_buffer.length > 5) {
              console.error('EON: You\'re publishing messages faster than the chart can render with flow. Consider turning off flow or reducing animation duration.');
            }

            renderNext();

          };

          self.chart.flow(options.flow);

        } else {

          self.chart.load(m);
          setTimeout(function(){
            renderNext();
          }, options.rate);

        }

      } else {
        setTimeout(function(){
          renderNext();
        }, options.rate);
      }

    };

    var boot = function() {

      options.generate.data.columns = [];
      self.chart = c3.generate(options.generate);

      self.pubnub.init({
        subscribe_key: options.subscribe_key
      });

      if(options.history) {
        page();
      }

      eon.c.subscribe(self.pubnub, options.channel, options.connect, function(message, env, channel) {

        options.message(message, env, channel);
        message_buffer.push(message);

      });

      renderNext();

      return self;

    };

    if(error) {
      console.error("EON: " + error);
    } else {
      boot();
    }

    return self.chart;

  }
};
eon.chart = function(o) {
  return new eon.c.create(o);
};