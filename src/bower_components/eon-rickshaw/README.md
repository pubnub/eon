PubNub + Rickshaw
===============

Make your Rickshaw graphs realtime with PubNub.

![](http://i.imgur.com/yxT6JrU.gif)

## Quickstart

```js
new Rickshaw.Fixtures.PubNub({
  graph: graph,
  subscribe_key: 'demo',
  channel: 'rickshaw-channel-2',
  history: true,
  connect: init,
});
```

Parameter | Value | Default
| :------------ |:---------------| -----:|
| graph | Your Rickshaw.Graph. Works just like the extensions included in Rickshaw examples. | ```undefined```
| subscribe_key | Your PubNub subscribe_key | ```demo```
| limit | The size of your buffer. How many values on the x series to display before shifting data. | ```50```
| history | Use PubNub history call to retrieve last ```limit``` messages. Requires [PubNub storage](http://www.pubnub.com/how-it-works/storage-and-playback/) to be enabled. | ```false```
| ready | This function fires once data has been retrieved from PubNub. Some extensions assume the graph will have data when they are initialized, so we ca n put them inside here. | ```function(){}```

## Simple Example

Include the Javascripts within your file.

```js
<script src="http://cdn.pubnub.com/pubnub.min.js"></script>
<script src="../vendor/d3.v3.js"></script>
<script src="../rickshaw.min.js"></script>
<script src="../src/js/Rickshaw.Fixtures.PubNub.js"></script>
```

Define a Rickshaw chart element as normal.

```html
<div id="chart"></div>

<script>
var graph = new Rickshaw.Graph( {
    element: document.getElementById("chart"),
    width: 900,
    height: 500,
    renderer: 'area',
    stroke: true,
    preserve: true,
    series: [
        {
            color: 'steelblue',
            name: 'Cats',
            data: []
        },
        {
            color: 'lightblue',
            name: 'Dogs',
            data: []
        }
    ]
});
graph.render();
</script>
```

Add PubNub Fixture.

```js
<script>
new Rickshaw.Fixtures.PubNub({
  channel: 'rickshaw-channel-1',
  graph: graph
});
</script>
```

## Kitchen Sink

Check out the [PubNub Extension demo](https://github.com/pubnub/pubnub-rickshaw/blob/master/rickshaw/examples/pubnub-extensions.html) for an example of using the PubNub fixture within a complicated Rickshaw setup.

Note that you need to initialize other fixtures within our connection callback. Some fixtures will cause errors if they are initialized before there is data in the chart.

## Publish Messages

This uses the included PubNub library to pubnub.publish() 
packets to the pubnub.subscribe() call waiting inside the 
Rickshaw framework. 

Notice how the ```subscribe_key``` and ```channel```  matches.

You probably want to publish data from the back-end instead. 
Check out our docs for more info:

http://www.pubnub.com/docs

```js
var pubnub = PUBNUB.init({
  publish_key: 'demo',
  subscribe_key: 'demo'
});

setInterval(function(){
  pubnub.publish({
    channel: 'rickshaw-channel-1',
    message: {
      y: [
        Math.random() * 99, 
        Math.random() * 99
      ],
      x: new Date().getTime()
    }
  })
}, 1000);
</script>
``` 

## Customize Your Graph

You can learn more about customizing your graph from [the official Rickshaw docs](https://github.com/shutterstock/rickshaw/blob/master/README.md).

## Shutterstock Rickshaw

Rickshaw Copyright (C) 2011-2013 by Shutterstock Images, LLC
