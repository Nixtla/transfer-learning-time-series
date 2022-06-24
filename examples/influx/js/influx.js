import {InfluxDB, flux} from 'https://unpkg.com/@influxdata/influxdb-client-browser/dist/index.browser.mjs'

const url = ""
const token = ''
const org = ''
const bucket = ''
const bearer = ''

const client = new InfluxDB({url: url, token: token})
const queryApi = client.getQueryApi(org)

const query = flux`from(bucket: "${bucket}") 
  |> range(start: -100y)
  |> filter(fn: (r) => r._measurement == "data")`

let values=[];
let dates=[];


let options={
  chart: {
        renderTo: 'container'
  },
  title: {
    text: 'Forecasts for AirPassengers data'
  },
  subtitle: {
    text: 'Forecast using AutoARIMA model'
  },
  yAxis: {
    title: {
      text: 'Number of Passengers'
    }
  },
  xAxis: {
    accessibility: {
      rangeDescription: 'Range: 1949 to 2021'
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
      pointStart: Date.UTC(1949, 0, 1)
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

queryApi.queryRows(query, {
    next(row, tableMeta) {
        const o = tableMeta.toObject(row)
		values.push(o._value)
		dates.push(o._time)
    },
    error(error) {
        console.error(error)
        console.log('Finished ERROR')
    },
    complete() {
		const api_options = {
		  method: 'POST',
		  headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${bearer}` 
		  },
		  body: JSON.stringify({
			timestamp: dates, 
			value: values,
			fh: 12,
			seasonality: 12,
			cv: false,
			model: 'arima'
		  })
		}
		console.log(api_options)
		fetch('http://nixtla.io/forecast', api_options)
		  .then(response => response.json())
		  .then(response => {
			options.series[0] = {
			  name: 'AirPassengers',
			  data: values,
			  color: 'black',
			  label: {
				enabled: false
			  },
			};
			var predintervals = [];
			let i;
			for (i=0; i<values.length; i++){
			  predintervals[i] = [null, null];
			};
			for (i=values.length; i<values.length+12; i++){
			  predintervals[i] = [response.lo[i-values.length], response.hi[i-values.length]];
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
			  name: 'AirPassengers Forecast',
			  data: Array(values.length).fill(null).concat(response.value),
			  color: 'red',
			  label: {
				enabled: false
			  },
			};
			console.log(options)
			var chart = new Highcharts.Chart(options);
		  })
		  .catch(err => console.error(err))	
    },
});

