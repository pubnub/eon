var pubnub_mapbox = function (options) {

  var self = this;

  var map = options.map || false;

  options.channel = options.channel || false;
  options.subscribe_key = options.subscribe_key || 'demo';
  options.init = options.init || function(){};
  options.history = options.history || false;

  self.markers = [];

  self.refreshRate = 10;
  self.following = false;

  self.map = map;
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
    self.followMark();

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

    };

  };

  self.follow = function(data) {
    self.following = data;
  };

  self.followMark = function(){

    if(self.following) {

      var zoom = 13;
      var index = 0;

      if(self.following.hasOwnProperty('zoom')) {
        zoom = self.following.zoom;
      }
      if(self.following.hasOwnProperty('index')) {
        index = self.following.index;
      }

      map.setView(self.markers[index].getLatLng(), zoom);

    }

  };

  var pubnub = PUBNUB.init({
      publish_key   : 'demo',
      subscribe_key : 'demo'
  });

  pubnub.subscribe({
    channel : options.channel,
    message : function(new_torchys,env,channel){

      self.update(new_torchys, true);

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
            options.init();
          }
       });

      } else {
        options.init();
      }

    }
  });

  self.refresh();
  setInterval(self.refresh, self.refreshRate);

};

var eon = eon || {};
eon.mapbox = pubnub_mapbox;