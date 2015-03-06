eon.chart({
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
    }
  }
});