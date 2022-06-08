d3.csv("https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/ercot_COAST.csv", function(err, rows){

  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]; });
}


var trace1 = {
  type: "scatter",
  mode: "lines",
  name: 'Ercot COAST',
  x: unpack(rows, 'Hour Ending'),
  y: unpack(rows, 'COAST'),
  line: {color: '#17BECF'}
}

var layout = {
  title: 'Ercot COAST',
  xaxis: {
	title: 'Timestamp',
    titlefont: {
      family: 'Arial, sans-serif',
      size: 12,
      color: 'black'
    },
    tickfont: {
      family: 'Old Standard TT, serif',
      size: 8,
      color: 'black'
    },
  },
  yaxis: {
    title: 'Value',
    titlefont: {
      family: 'Arial, sans-serif',
      size: 12,
      color: 'black'
    },
    tickfont: {
      family: 'Old Standard TT, serif',
      size: 12,
      color: 'black'
    },
  }
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
    fh: 24,
    seasonality: 7,
    cv: false,
	model: 'nhits_m4_hourly'
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
	var predintervals = {
	  type: "scatter",
	  name: "Prediction Intervals",
      fill: "toself",
      fillcolor: "rgba(231,107,243,0.2)",
	  x: response.timestamp.concat(response.timestamp.slice().reverse()),
	  y: response.hi.concat(response.lo.slice().reverse()),
	  line: {color: 'transparent'},
	};
    console.log(predintervals);
    Plotly.newPlot('myDiv', [trace1, forecastplot, predintervals], layout);
  })
  .catch(err => console.error(err));
});

