d3.csv("https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv", function(err, rows){

  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}


var trace1 = {
  type: "scatter",
  mode: "lines",
  name: 'AAPL High',
  x: unpack(rows, 'Date'),
  y: unpack(rows, 'AAPL.High'),
  line: {color: '#17BECF'}
}

var layout = {
  title: 'Basic Time Series',
};

Plotly.newPlot('myDiv', [trace1], layout);

const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRzcDUxYkp4UllkSXgxdkh3V3VRMyJ9.eyJpc3MiOiJodHRwczovL2Rldi00aGo1emVnay51cy5hdXRoMC5jb20vIiwic3ViIjoiNEoxUmhhNW1ZclV3OHpqQWFXVks2QTJKc2RXVFZNd0NAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vY3J5c3RhbC1iYWxsLWF1dGgwLmNvbSIsImlhdCI6MTY1MzUyMjYyNywiZXhwIjoxNjU2MTE0NjI3LCJhenAiOiI0SjFSaGE1bVlyVXc4empBYVdWSzZBMkpzZFdUVk13QyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.WS8gWjaTPSCKSRHbVwSjWf-ArbfiS7epxPw0boY_tS9aUfKQexbm47Ys-rR2g7hmhjgLd2M0RREx0onQVN7fyBPnoND49ki48xWq99JSoy-NOxu6ZGZyccvEwtgurCpDZsbwjXo8gyrRqzH9iELoDbFlwqbX7IAPaq4DvottoHP0E_K6VjCovftP5c84GWDpvdSY_Dtlal1PvsHyQGVBZSVvpMHZ1rEiMdeF6kRaFOt6ASZUMjmwXo5LvJcpHrOKqVryG0ApNPNUXkfoAJ7G8jl18yWl7ekbgPLuf8CBCfFxA6ZevTqCgUWQfGPGR_BGqNHOOi4N-AzDJID1Jbrjyg'
  },
  body: JSON.stringify({
    timestamp: trace1.x,
    value: trace1.y,
    fh: 14,
    seasonality: 7,
    cv: false
  })
};


fetch('http://nixtla.io/forecast', options)
  .then(response => response.json())
  .then(response => {
	var forecastplot = {
	  type: "scatter",
	  mode: "lines",
	  name: "Forecast",
	  x: response.timestamp,
	  y: response.value,
	  line: {color: 'red'}
	};
    console.log(forecastplot);
    Plotly.newPlot('myDiv', [trace1, forecastplot], layout);
  })
  .catch(err => console.error(err));
})

