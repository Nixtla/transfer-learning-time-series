import json
import os
import requests
import sys

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

DATASETS = {
	'Peyton Manning': 'https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/peyton_manning.csv', 
    'Ercot COAST': 'https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/ercot_COAST.csv',
    'AirPassengers': 'https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/air_passengers.csv',
    'Exchange USD-EUR': 'https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/usdeur.csv',
}

def plot(df, df_forecast=None, df_anomaly=None, df_intervals=None):
	figs = []
	if df_intervals is not None:
		ds = df_intervals['timestamp_insample'].to_list()
		lo = df_intervals['lo'].to_list()
		hi = df_intervals['hi'].to_list()
		figs += [
			go.Scatter(x=ds + ds[::-1],
					   y=hi+lo[::-1],
					   fill='toself',
					   fillcolor='green',
					   mode='lines',
					   line=dict(color='green'),
					   name='Insample Prediction Intervals',
					   legendrank=5,
					   opacity=0.5,
					   hoverinfo='skip'),
		]
	figs += [
        go.Scatter(x=df['timestamp'], y=df['value'], 
                   mode='lines',
                   marker=dict(color='#236796'),
                   legendrank=1,
                   name='History'),
	]
	if df_forecast is not None:
		ds_f = df_forecast['timestamp'].to_list()
		lo = df_forecast['lo'].to_list()
		hi = df_forecast['hi'].to_list()
		figs += [
			go.Scatter(x=ds_f + ds_f[::-1],
					   y=hi+lo[::-1],
					   fill='toself',
					   fillcolor='#E7C4C0',
					   mode='lines',
					   line=dict(color='#E7C4C0'),
					   name='Prediction Intervals (90%)',
					   legendrank=5,
					   opacity=0.5,
					   hoverinfo='skip'),
			go.Scatter(x=ds_f, 
					   y=df_forecast['value'], 
					   mode='lines',
					   legendrank=4,
					   marker=dict(color='#E7C4C0'),
					   name='Forecast'),
		]
	if df_anomaly is not None:
		figs += [
			go.Scatter(x=df_anomaly['timestamp'],
            		   y=df_anomaly['value'],
                       mode='markers',
                       marker=dict(color='red', size=15),
                       name='Anomalies'),
		]
	fig = go.Figure(figs)
	fig.update_layout({
        "plot_bgcolor": "rgba(0, 0, 0, 0)",
        "paper_bgcolor": "rgba(0, 0, 0, 0)"
	})
	fig.update_layout(
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        ),
        margin=dict(l=20, b=20)
    )
	return fig


st.set_page_config(
    page_title="Time Series Visualization",
    page_icon="🔮",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("🔮 Historical and Future behaviour of a time series")

intro="""
This example shows how to produce forecasts using Nixtla's API.
"""
st.write(intro)

st.header("Test on your own Data")
### Config 
url = 'http://nixtla.io'
st.write(
		"You can point to a URL containing a JSON file like [this one](https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json)"
		" or a CSV like [this one](https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/air_passengers.csv)"
)
row1_1, row1_2 = st.columns((2, 2))

with row1_1:
	data_selection = st.selectbox('Select example dataset', DATASETS.keys())
	data_url = DATASETS[data_selection]
	url_json = st.text_input(
			'Data (you can pass your own url here)',
			data_url
			)
	st.write("You can also upload a CSV file like [this one](https://github.com/Nixtla/transfer-learning-time-series/blob/main/datasets/air_passengers.csv).")

	uploaded_file = st.file_uploader('Upload CSV')
	with st.form('Data'):
		
		if uploaded_file is not None:
			df = pd.read_csv(uploaded_file)
			cols = df.columns
			timestamp_col = st.selectbox('Timestamp column', options=cols)
			value_col = st.selectbox('Value column', options=cols)
		else:
			timestamp_col = st.text_input('Timestamp column', value='timestamp')
			value_col = st.text_input('Value column', value='value')
		st.write('You must press Submit each time you want to forecast.')
		submitted = st.form_submit_button('Submit')
		if submitted:
			if uploaded_file is None:
				st.write('Please provide a dataframe.')
				if url_json.endswith('json'):
					df = pd.read_json(url_json)
				else:
					df = pd.read_csv(url_json)
				df.columns = ['timestamp', 'value']
			else:
			#df = pd.read_csv(uploaded_file)
				df = df.rename(columns={timestamp_col: 'timestamp', value_col: 'value'})
		else:
			if url_json.endswith('json'):
				df = pd.read_json(url_json)
			else:
				df = pd.read_csv(url_json)
			df.columns = ['timestamp', 'value']

		df['timestamp'] = pd.to_datetime(df['timestamp'])
		df = df.sort_values('timestamp')
		df['timestamp'] = df['timestamp'].astype(str)
	df = df.tail(300)

with row1_2:
	# forecast code
	payload = dict(
		timestamp=df['timestamp'].to_list(),
		value=df['value'].to_list(),
		fh=12,
		seasonality=12,
		model='arima'
	)
	headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": f"Bearer {os.environ['BEARER_STREAMLIT']}"
	}
	response = requests.post('http://app.nixtla.io/forecast', json=payload, headers=headers)
	df_forecast = pd.DataFrame(json.loads(response.text))

	# anomalies code
	level = st.select_slider('Anomalies sensibility', options=[80, 85, 90, 95, 99], value=99)

	payload = dict(
		timestamp=df['timestamp'].to_list(),
		value=df['value'].to_list(),
		sensibility=level
	)
	headers = {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"Authorization": f"Bearer {os.environ['BEARER_STREAMLIT']}"
		
	}
	response = requests.post('http://app.nixtla.io/automl_anomaly', json=payload, headers=headers)
	response = json.loads(response.text)
	df_anomaly = pd.DataFrame({key: response[key] for key in ['timestamp', 'value']})
	df_intervals = pd.DataFrame({key: response[key] for key in ['timestamp_insample', 'lo', 'hi']})
	# plot without forecast
	#st.plotly_chart(plot(df.tail(200)), use_container_width=True)

	# plot with forecast
	#st.plotly_chart(plot(df.tail(200), df_forecast), use_container_width=True)

	# plot with forecast and anomalies
	st.plotly_chart(plot(df.tail(200), df_forecast, df_anomaly, df_intervals), use_container_width=False)

