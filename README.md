# EON Realtime Dashboards

This is the repository for the compiled EON framework, including [eon-chart](https://github.com/pubnub/eon-chart) and [eon-map](https://github.com/pubnub/eon-map).

[Product Website](http://pubnub.com/developers/eon/)

# Quick Start

```html
<script type="text/javascript" src="//pubnub.github.io/eon/v/eon/0.0.9/eon.js"></script>
<link type="text/css" rel="stylesheet" href="//pubnub.github.io/eon/v/eon/0.0.9/eon.css" />
```

# Documentation

This repository contains ```gh-pages``` and ```gulp``` tasks to compile the full EON framework. Each module has it's own repository and documentation found below.

### Charts

<a href="https://github.com/pubnub/eon-chart">

EON Charts Documentation

<img src="http://i.imgur.com/IPGPKYO.gif"/>
</a>

### Maps

<a href="https://github.com/pubnub/eon-map">

EON Maps Documentation

<img src="http://i.imgur.com/8am5hZ9.gif"/>
</a>

# Development

Clone this repository.

```
git clone https://github.com/pubnub/eon.git
```

Install bower dependencies.

```
cd src
bower install
```

Compile.

```
gulp
```

# Note on Hotlinking

```//pubnub.github.io/eon/lib/eon.js``` is stuck at version ```0.0.7```, please use versioned hotlinking, for example: ```//pubnub.github.io/eon/v/eon/0.0.9/eon.js```.
