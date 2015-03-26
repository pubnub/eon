var channel_chart = 'eon-chart-';// + Math.ceil(Math.random() * 10000);

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

L.RotatedMarker = L.Marker.extend({
  options: { angle: 0 },
  _setPos: function(pos) {
    L.Marker.prototype._setPos.call(this, pos);
    if (L.DomUtil.TRANSFORM) {
      // use the CSS transform rule if available
      this._icon.style[L.DomUtil.TRANSFORM] += ' rotate(' + this.options.angle + 'deg)';
    } else if (L.Browser.ie) {
      // fallback for IE6, IE7, IE8
      var rad = this.options.angle * L.LatLng.DEG_TO_RAD,
      costheta = Math.cos(rad),
      sintheta = Math.sin(rad);
      this._icon.style.filter += ' progid:DXImageTransform.Microsoft.Matrix(sizingMethod=\'auto expand\', M11=' +
        costheta + ', M12=' + (-sintheta) + ', M21=' + sintheta + ', M22=' + costheta + ')';
    }

  }
});

var map = eon.map({
  id: 'map',
  mb_id: 'ianjennings.06d6eddb',
  mb_token: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
  channel: 'sfo-flight-data',
  rotate: true,
  history: true,
  marker: function (latlng, data) {

    console.log(data)

    var marker = new L.RotatedMarker(latlng, {
      icon: L.icon({
        iconUrl: '  http://i.imgur.com/obDmYn4.png',
        iconSize: [24, 24]
      })
    });

    var popup = '';
    if(data[13]) {
      popup = 'Flight <strong>' + data[13] + '</strong>';
    }
    if(data[11]) {
      if(!popup.length) {
        popup = 'Flight from ' + data[11];
      } else {
        popup += ' from ' + data[11];
      }
    }
    if(data[12]) {
      if(!popup.length) {
        popup = 'Flight to ' + data[12];
      } else {
        popup += ' to ' + data[12];
      }
    }
    if(!popup.length) {
      popup = 'No data available';
    }

    marker.bindPopup(popup);

    return marker;
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
  chart: function() {

    for (var i = 0; i < origins.chart.length; i++) {

      new_value = Math.round(origins.chart[i][1] + (getNonZeroRandomNumber() * .1));
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
    channel: channel_chart,
    message: {
      columns: data.chart()
    }
  });

}, 2000);
