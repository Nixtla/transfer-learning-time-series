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
    Authorization: 'Bearer <your_api_key>'
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

