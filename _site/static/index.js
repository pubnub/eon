var channel_map  = 'eon-map-' + Math.ceil(Math.random() * 10000);
var channel_chart = 'eon-chart-' + Math.ceil(Math.random() * 10000);

eon.chart({
  channel:  channel_chart,
  generate: {
    bindto: '#bar-chart',
    data: {
      labels: false,
      type: 'bar',
      colors: {
        Me: '#b35258',
        Nick: '#C7E4DE',
        Ritika: '#BBD6D1',
        Emily: '#B0C9C4',
        Sami: '#A5BDB8'
      }
    },
    bar: {
      width: {
        ratio: 0.75
      }
    },
    axis: {
      x: {
        show: false
      }
    },
    legend: {
      show: false
    },
    tooltip: {
        show: false
    },
    size: {
      height: 160,
      width: 200
    }
  }
});

eon.chart({
  channel: channel_chart,
  flow: {
    duration: 100
  },
  limit: 5,
  generate: {
    bindto: '#spline-chart',
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
    },
    legend: {
      show: false
    },
    tooltip: {
        show: false
    }
  }
});

eon.chart({
  channel: channel_chart,
  flow: {
    duration: 1
  },
  generate: {
    bindto: '#pie-chart',
    data: {
      type: 'donut',
      colors: {
        Me: '#b35258',
        Nick: '#C7E4DE',
        Ritika: '#BBD6D1',
        Emily: '#B0C9C4',
        Sami: '#A5BDB8'
      }
    },
    donut: {
      label: {
        show: false
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      show: false
    },
    size: {
      height: 160,
      width: 160
    }
  }
});

var map = eon.map({
  mb_token: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
  mb_id: 'ianjennings.06d6eddb',
  channel:  channel_map,
  message: function(data) {
    map.setView(data[0].latlng, 13);
  }
});

// Disable drag and zoom handlers.
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

// Disable tap handler, if present.
if (map.tap) map.tap.disable();

// helper function
function getNonZeroRandomNumber(){
  var random = Math.floor(Math.random()*199) - 99;
  if(random==0) return getNonZeroRandomNumber();
  return random;
}

var them = {
  icon: {
    'marker-color': '#c7e4de'
  }
};

var origins = {
  map: [
    {
      latlng: [30.293479, -97.742405],
      options: {
        icon: {
          'marker-color': '#b35258'
        }
      }
    },
    {
      latlng: [30.370375, -97.756138],
      options: {
        icon: {
          'marker-color': '#C7E4DE'
        }
      }
    },
    {
      latlng: [30.323118, -97.739144],
      options: {
        icon: {
          'marker-color': '#BBD6D1'
        }
      }
    },
    {
      latlng: [30.302816, -97.699490],
      options: {
        icon: {
          'marker-color': '#B0C9C4'
        }
      }
    },
    {
      latlng: [30.250337, -97.754593],
      options: {
        icon: {
          'marker-color': '#A5BDB8'
        }
      }
    }
  ],
  chart: [
    ['Me', 50],
    ['Nick', 50],
    ['Ritika', 50],
    ['Emily', 50],
    ['Sami', 50]
  ]
};

var copy = function (data) {
  return JSON.parse(JSON.stringify(data));
};

var data = {
  map: function(){

    var new_data = copy(origins.map);
    for (var i = 0; i < new_data.length; i++) {

      new_data[i] = {
        options: new_data[i].options,
        latlng: [
          new_data[i].latlng[0] + (getNonZeroRandomNumber() * 0.0002),
          new_data[i].latlng[1] + (getNonZeroRandomNumber() * 0.0002)
        ]
      }

    }

    return new_data;

  },
  chart: function() {

    for (var i = 0; i < origins.chart.length; i++) {

      new_value = origins.chart[i][1] + (getNonZeroRandomNumber() * .1);
      origins.chart[i][1] = new_value;

    }

    return origins.chart;

  }
};

var pubnub = PUBNUB.init({
  publish_key: 'demo',
  subscribe_key: 'demo'
});

setInterval(function(){

  pubnub.publish({
    channel:  channel_map,
    message: data.map()
  });

}, 3000);

setInterval(function(){

  pubnub.publish({
    channel: channel_chart,
    message: {
      columns: data.chart()
    }
  });

}, 2000);
