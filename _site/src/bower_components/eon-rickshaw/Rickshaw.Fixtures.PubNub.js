Rickshaw.namespace('Rickshaw.Fixtures.PubNub');

Rickshaw.Fixtures.PubNub = function (options) {

  if(typeof(PUBNUB) == "undefined" && console) {
    console.error("PubNub not found. See http://www.pubnub.com/docs/javascript/javascript-sdk.html#_where_do_i_get_the_code");
  }

  var self = this;

  // set default options
  options.subscribe_key = options.subscribe_key || 'demo';
  options.limit = options.limit || 50;
  options.history = options.history || false;
  options.connect = options.connect || function () {};
  options.channel = options.channel || false;

  // initialize pubnub
  self.pubnub = PUBNUB.init({
    publish_key: options.publish_key,
    subscribe_key: options.subscribe_key
  });

  // handy function to run something once
  var first = true;

  self.page = function() {

    all_messages = [];

    getAllMessages = function(timetoken) {
       self.pubnub.history({
        channel: options.channel,
        start: timetoken,
         callback: function(payload) {

           var msgs = payload[0];
           var start = payload[1];
           var end = payload[2];

           if (msgs != undefined && msgs.length) {

             msgs.reverse();

             i = 0;
             while(i < msgs.length) {
               all_messages.push(msgs[[i]]);
               i++;
             }

           }

           // if 100 msgs were retrieved, there might be more; call history again
           if (msgs.length && all_messages.length < options.limit) {
             getAllMessages(start);
           } else {

            all_messages.reverse();
             i = 0;
             while(i < all_messages.length) {              //
               self.pushMessage(all_messages[i]);
               i++;
             }
           }

         }
       });
     };

     getAllMessages();

  }

  // push pubnub message data to end of series
  self.pushMessage = function (m) {

    var i = 0;
    while(i < m.y.length) {

      options.graph.series[i].data.push({
        x: m.x,
        y: m.y[i]
      });

      i++;

    }

    // shift the array if we're over limit
    if(options.graph.series[0].data.length > options.limit) {

      i = 0;
      while(i < options.graph.series.length) {
        options.graph.series[i].data.shift();
        i++;
      }

    }

    if(first) {
      options.connect();
    }
    first = false;

    // render the graph
    options.graph.update();

  };

  // subscribe to the pubnub channel
  self.pubnub.subscribe({
    channel: options.channel,
    message: function (m) {
      self.pushMessage(m);
    }
  });

  if(options.history) {

    // fetch last page from pubnub
    self.page();
  }

};

var eon = eon || {};
eon.rickshaw = Rickshaw.Fixtures.PubNub;