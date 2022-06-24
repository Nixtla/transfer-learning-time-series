let options={
  chart: {
        renderTo: 'container'
  },
  title: {
    text: 'Solar Employment Growth by Sector, 2010-2017 (forecast 2018-2021)'
  },
  subtitle: {
    text: 'Forecast using AutoARIMA model'
  },
  yAxis: {
    title: {
      text: 'Number of Employees'
    }
  },
  xAxis: {
    accessibility: {
      rangeDescription: 'Range: 2010 to 2021'
    }
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle'
  },
  plotOptions: {
    series: {
      label: {
        connectorAllowed: false
      },
      pointStart: 2010
    }
  },
  series: [{}],
  responsive: {
    rules: [{
      condition: {
        maxWidth: 500
      },
      chartOptions: {
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom'
        }
      }
    }]
  }
}

const api_options = {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Bearer <you_api_key>' 
  },
  body: JSON.stringify({
    timestamp: ['2010-01-01', '2011-01-01', '2012-01-01', '2013-01-01', '2014-01-01', '2015-01-01', '2016-01-01', '2017-01-01'],
    value: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
    fh: 3,
    seasonality: 1,
    cv: false,
    model: 'arima'
  })
};


fetch('http://nixtla.io/forecast', api_options)
  .then(response => response.json())
  .then(response => {
    options.series[0] = {
      name: 'Installation',
      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175],
      color: 'black',
      label: {
        enabled: false
      },
    };
    var predintervals = [];
    for (i=0; i<8; i++){
      predintervals[i] = [null, null];
    };
    for (i=8; i<11; i++){
      predintervals[i] = [response.lo[i-8], response.hi[i-8]];
	};
    options.series[1] = {
      name: 'Prediction Intervals',
      data: predintervals,
      type: 'arearange',
      color: 'rgba(231,107,243,0.2)',
      label: {
        enabled: false
      },
    };
    options.series[2] = {
      name: 'Installation Forecast',
      data: Array(8).fill(null).concat(response.value),
      color: 'red',
      label: {
        enabled: false
      },
    };
    var chart = new Highcharts.Chart(options);
  })
  .catch(err => console.error(err));

