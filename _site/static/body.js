eon.chart({
  message: function (data) {
    $('#body-spline-data').html(JSON.stringify(data));
    $('#body-spline-data').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  },
  channel: channel_chart,
  flow: {
    duration: 100
  },
  limit: 20,
  history: true,
  generate: {
    bindto: '#body-spline',
    data: {
      labels: false,
      colors: {
        Me: '#b35258',
        Nick: '#C7E4DE',
        Ritika: '#BBD6D1',
        Emily: '#B0C9C4',
        Sami: '#A5BDB8'
      }
    },
    axis: {
      x: {
        show: false
      }
    }
  }
});

var another_map = eon.map({
  id: 'eon-map-demo',
  mb_token: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
  mb_id: 'ianjennings.l896mh2e',
  channel:  'eon-map-demo',
  message: function(data) {

    $('#body-map-data').html(JSON.stringify(data));
    $('#body-map-data').each(function(i, block) {
      hljs.highlightBlock(block);
    });

  }
});


// Disable drag and zoom handlers.
another_map.dragging.disable();
another_map.touchZoom.disable();
another_map.doubleClickZoom.disable();
another_map.scrollWheelZoom.disable();

// Disable tap handler, if present.
if (another_map.tap) another_map.tap.disable();

setInterval(function(){

  var anew_point = JSON.parse(JSON.stringify({ latlng: [37.370375, -97.756138] }));

  anew_point.latlng = [
    Math.round(anew_point.latlng[0] + getNonZeroRandomNumber() * 0.1),
    Math.round(anew_point.latlng[1] + getNonZeroRandomNumber() * 0.2)
  ];

  PUBNUB.publish({
    channel: 'eon-map-demo',
    message: [anew_point]
  });

}, 1000);