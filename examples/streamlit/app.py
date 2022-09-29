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


def plot(df, df_forecast=None, df_anomaly=None):
	figs = [
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

file = 'https://raw.githubusercontent.com/Nixtla/transfer-learning-time-series/main/datasets/peyton_manning.csv'
df = pd.read_csv(file).tail(300)

# forecast code
payload = dict(
	timestamp=df['timestamp'].to_list(),
	value=df['value'].to_list(),
	fh=12,
	seasonality=12,
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
	level=level
)
headers = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"Authorization": f"Bearer {os.environ['BEARER_STREAMLIT']}"
	
}
response = requests.post('http://app.nixtla.io/anomaly_detector', json=payload, headers=headers)
df_anomaly = pd.DataFrame(json.loads(response.text))

# plot without forecast
#st.plotly_chart(plot(df.tail(200)), use_container_width=True)

# plot with forecast
#st.plotly_chart(plot(df.tail(200), df_forecast), use_container_width=True)

# plot with forecast and anomalies
st.plotly_chart(plot(df.tail(200), df_forecast, df_anomaly), use_container_width=True)

