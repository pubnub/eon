# PubNub + Mapbox

Real-time location tracking. 

![](http://i.imgur.com/25Zg5YB.gif)

## Quickstart

```js
eon.map({
  mb_token: 'mapbox api token',
  mb_id: 'mapbox map id',
  subscribe_key: 'demo',
  channel: 'my map channel',
  history: false,
  connect: connect,
});
```

### Init

Parameter | Value | Default
| :------------ |:---------------| -----:|
| graph | Mapbox map object. | ```undefined```
| subscribe_key | Your PubNub subscribe_key | ```demo```
| history | Use PubNub history call to retrieve last message. This will display points at their last known location. Requires [PubNub storage](http://www.pubnub.com/how-it-works/storage-and-playback/) to be enabled. | ```false```
| connect | This function fires once data has been retrieved from PubNub.  | ```function(){}```

## Simple Example

Include ```mapbox.css```, ```mapbox.js```, ```pubnub.js```, and ```pubnub_mapbox.js```.

```js
<link href='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.css' rel='stylesheet' />
<script src='https://api.tiles.mapbox.com/mapbox.js/v2.1.5/mapbox.js'></script>
<script src="http://cdn.pubnub.com/pubnub-3.7.1.min.js"></script>
<script src="pubnub_mapbox.js"></script>
```

Then, call ```eon.map({})```. Check out the table of options above for more information.

```js
var channel = 'pubnub-mapbox';

eon.map({
  mb_token: 'pk.eyJ1IjoiaWFuamVubmluZ3MiLCJhIjoiZExwb0p5WSJ9.XLi48h-NOyJOCJuu1-h-Jg',
  mb_id: 'ianjennings.l896mh2e',
  channel: channel,
  connect: connect
});
```

![](http://i.imgur.com/QtJ7E3d.gif)

## Lat/Long Values

```eon.map``` expects an array of objects to be published on the same channel it's subscribed to. More on publishing in the next section.

For example, below you can find a list of all the Torchy's Tacos in Austin, TX.

```js
var torchys = [
  { latlng: [30.370375, -97.756138] },
  { latlng: [30.323118, -97.739144] },
  { latlng: [30.302816, -97.699490] },
  { latlng: [30.293479, -97.742405] },
  { latlng: [30.250337, -97.754593] },
  { latlng: [30.236689, -97.762730] }
];
```

## Publishing Messages

The function below is called ```connect``` and fires when the ```pubnub_mapbox``` library is ready.

This function uses the included PubNub library to pubnub.publish() 
packets to the pubnub.subscribe() call waiting inside the 
Mapbox framework. 

Notice how the ```subscribe_key``` and ```channel```  matches.

```js

function connect() {

var point = {
  latlng: [37.370375, -97.756138]
};

var pn = PUBNUB.init({
  publish_key: 'demo'
});

setInterval(function(){

  var new_point = JSON.parse(JSON.stringify(point));

  new_point.latlng = [
    new_point.latlng[0] + (getNonZeroRandomNumber() * 0.1),
    new_point.latlng[1] + (getNonZeroRandomNumber() * 0.2)
  ];

  pn.publish({
    channel: channel,
    message: [new_point] // even a single point should be an array
  });

}, 500);

};
```

You probably want to publish data from the back-end instead. 
Check out our docs for more info:

http://www.pubnub.com/docs

## Following a Point

You can tell the map to follow a point to it's new location whenever data is received. 

Parameter | Value | Default
| :------------ |:---------------| -----:|
| index | Index of points provided to Mapbox | ```0```
| zoom | Mapbox zoom level | ```13```

```js
pnmap.follow({
  index: 3,
  zoom: 13
});
```

## Market Customization

You can supply Mapbox icon properties as ```options``` in the same objects as ```latlong``` values on publish. You can find a detailed list of properties and values [here](https://www.mapbox.com/mapbox.js/example/v1.0.0/custom-marker/). 

```js
var torchys = [
    {
        latlng: [30.370375, -97.756138],
        options: {   
            icon: {
                'marker-color': '#ce1126'
            }
        }
    },
```

## Kitchen Sink

Check out the ```extra.html``` demo for an example of tracking multiple markers on a graph.

## Customizing with Mapbox

The MapBox map object is returned by ```eon.mapbox``` and can be customized using the [Mapbox API](https://www.mapbox.com/mapbox.js/api/v3.1.5/). Also see the [Mapbox examples page](https://www.mapbox.com/mapbox.js/example/v1.0.0/).

Also note that you can customize your map using Mapbox map editor. You can change the map background style, add static markers, etc. Visit [Mapbox](https://www.mapbox.com/) for your own API key.
