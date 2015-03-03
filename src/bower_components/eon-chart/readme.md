EON Realtime Charts
===============

Realtime animated graphs with [PubNub](http://pubnub.com) and [C3](http://c3js.org/).

## Examples

#### Spline Chart

![](http://i.imgur.com/MRK20Kb.gif)

[View Example](https://github.com/pubnub/eon-chart/blob/master/examples/spline.html)

#### Gauge Chart

![](http://i.imgur.com/hO4pwDp.gif)

[View Example](https://github.com/pubnub/eon-chart/blob/master/examples/gauge.html)

#### Donut Chart

![](http://i.imgur.com/YDydwZi.gif)

[View Example](https://github.com/pubnub/eon-chart/blob/master/examples/donut.html)

#### Bar Chart

![](http://i.imgur.com/cgecpFw.gif)

[View Example](https://github.com/pubnub/eon-chart/blob/master/htdocs/pubnub/bar.html)

#### Transforming Chart

![](http://i.imgur.com/6sUQEDX.gif)

[View Example](https://github.com/pubnub/eon-chart/blob/master/examples/transform.html)

## Quickstart

```html
<div id="chart"></div>
<script>
  eon.chart({
    channel: "c3-spline", // the pubnub channel for real time data
    generate: {},         // c3 chart object
    flow: {},             // flow configuration
    limit: 10             // the size of your data buffer
  });
</script>
```

Parameter | Value | Default
| :------------ |:---------------| -----:|
| subscribe_key | Your [PubNub subscribe_key](http://www.pubnub.com/knowledge-base/categories/licensing-api-keys) | ```demo```
| channel | Your [PubNub channel name](http://www.pubnub.com/docs/javascript/overview/data-push.html). | ```false```
| generate | Your [C3 chart generation config](http://c3js.org/gettingstarted.html#generate). | ```undefined```
| flow | C3 flow configuration. You should only be concerned with ```flow.duration``` which will adjust how long the animation between updates lasts. | ```350```
| limit | The size of your buffer. How many values to display on the chart before shifting the first value off and appending a new value. This is not native to C3. | ```10```
| history | Fill the buffer by using PubNub history call to retrieve last ```limit``` messages. Requires [PubNub storage](http://www.pubnub.com/how-it-works/storage-and-playback/) to be enabled. | ```false```

## Simple Example

Include the Javascripts within your file.

```js
<script src="http://cdn.pubnub.com/pubnub.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="../js/c3.js"></script>
<script src="../js/pubnub-c3.js"></script>
```

Plug your normal C3 config into the ```generate``` param. Supply a PubNub channel in `channel`` param. ```eon.chart``` returns the normal c3 chart object.

```html
<div id="chart"></div>
<script>
eon.chart({
  channel: "c3-spline",
  generate: {
    bindto: '#chart',
    data: {
      x: 'x',
      columns: [],
      labels: true
    },
    axis : {
      x : {
        type : 'timeseries',
        tick: {
          format: '%H:%M:%S'
        }
      }
    }
  }
});
</script>
```

That's it! Now you can publish messages to the same ```channel`` and they'll render in the graph.

Make sure your messages are in the format that C3 expects! For example:

```js
var pubnub = PUBNUB.init({
  publish_key: 'demo',
  subscribe_key: 'demo'
});
setInterval(function(){
  
  pubnub.publish({
    channel: 'c3-spline',
    message: {
      columns: [
        ['x', new Date().getTime()],
        ['Austin', Math.floor(Math.random() * 99)],
        ['New York', Math.floor(Math.random() * 99)],
        ['San Francisco', Math.floor(Math.random() * 99)],
        ['Portland', Math.floor(Math.random() * 99)]

      ]
    }
  });

}, 1000);
```

Notice how the ```subscribe_key``` and ```channel```  matches.

## More on Publishing Messages

This uses the included PubNub library to pubnub.publish() 
packets to the pubnub.subscribe() call waiting inside the 
C3 framework.

You probably want to publish data from the back-end instead. 
Check out our docs for more info:

[http://www.pubnub.com/docs](http://www.pubnub.com/docs)

## Customize Your Graph

eon-chart works will all supported graph types in C3. Just check out the examples above. 

You can learn more about customizing your graph from [the official C3 docs](http://c3js.org/gettingstarted.html#customize).

## Fast data with slow animations

If you happen to publish data at a higher frequency than your ```flow.duration``` than messages will get backed up in quene. An error will be displayed in the console if this is happening. You can fix this by decreasing your ```flow.duration```. 

## Message Quene

Incoming messages from PubNub are stored in a message quene until they are rendered. You can use ```options.rate``` to configure how often messages in the quene will be rendered. ```rate``` is set to ```10``` (ms) by default which will render messages immediately.
