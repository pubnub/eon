var eon = eon || {};
eon.map = function (options) {

  if(typeof(PUBNUB) == "undefined" && console) {
    return console.error("PubNub not found. See http://www.pubnub.com/docs/javascript/javascript-sdk.html#_where_do_i_get_the_code");
  }

  if(typeof(options.mb_token) == "undefined" && console) {
    return console.error("Please supply a Mapbox Token: https://www.mapbox.com/help/create-api-access-token/");
  }

  if(typeof(options.mb_id) == "undefined" && console) {
    return console.error("Please supply a Mapbox Map ID: https://www.mapbox.com/help/define-map-id/");
  }

  if(typeof(L) == "undefined" && console) {
    return console.error("You need to include the Mapbox Javascript library.");
  }

  var self = this;

  L.mapbox.accessToken = options.mb_token;

  self.map = L.mapbox.map('map', options.mb_id);

  options.channel = options.channel || false;
  options.subscribe_key = options.subscribe_key || eon.subscribe_key || 'demo';
  options.history = options.history || false;
  options.message = options.message || function(){};
  options.connect = options.connect || function(){};

  self.markers = [];

  self.refreshRate = 10;

  self.lastUpdate = new Date().getTime();

  self.update = function (seed, animate) {

    var i = 0;
    while(i < seed.length) {

      if(typeof self.markers[i] == 'undefined') {

        self.markers[i] = L.marker(seed[i].latlng);
        self.markers[i].addTo(self.map);

      } else {

        if(self.markers[i].lat !== seed[i].latlng[0] ||
           self.markers[i].getLatLng().lng !== seed[i].latlng[1]) {

          if(animate) {
            self.animate(i, seed[i].latlng);
          } else {
            self.updateMarker(i, seed[i].latlng);
          }

        }

      }

      if(typeof seed[i].options !== 'undefined') {

        for(j in seed[i].options) {

          if(j == 'icon') {
            self.markers[i].setIcon(L.mapbox.marker.icon(seed[i].options[j]));
          }

        }
      }

      i++;

    }

    self.lastUpdate = new Date().getTime();

  };

  self.updateMarker = function (index, point) {
    self.markers[index].setLatLng(point);
  };

  self.animations = {};

  self.animate = function (index, destination) {

    self.animations[index] = {
      start: self.markers[index].getLatLng(),
      dest: destination,
      time: new Date().getTime(),
      length: new Date().getTime() - self.lastUpdate
    };

  };

  self.refresh = function() {

    var index = 0;
    while(index < self.markers.length) {

      if(typeof self.animations[index] !== 'undefined') {

        // number of steps in this animations
        var maxSteps = Math.round(self.animations[index].length / self.refreshRate)

        // time that has passed since that message
        var timeSince = new Date().getTime() - self.animations[index].time;
        var numSteps = Math.round(timeSince / self.refreshRate)

        var position = self.animations[index].start;

        var lat = position.lat + ((self.animations[index].dest[0] - position.lat) / maxSteps) * numSteps;
        var lng = position.lng + ((self.animations[index].dest[1] - position.lng) / maxSteps) * numSteps;

        var nextStep = [lat, lng];

        self.updateMarker(index, nextStep);

      }

      index++;

    }

  };

  var pubnub = PUBNUB.init({
    subscribe_key: options.subscribe_key
  });

  pubnub.subscribe({
    channel : options.channel,
    message : function(message, env, channel){

      options.message(message, env, channel);
      self.update(message, true);

    },
    connect: function(){

      if(options.history) {

        pubnub.history({
          channel: channel,
          count: 1,
          callback: function(m) {
            if(m.length[0]) {
              self.update(m[0][0], true);
            }
            options.connect();
          }
       });

      } else {
        options.connect();
      }

    }
  });

  self.refresh();
  setInterval(self.refresh, self.refreshRate);

  return self.map;

}