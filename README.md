## Transfer learning for Time Series Forecasting
Transfer learning refers to the process of pre-training a flexible model on a large dataset and using it later on other data with little to no training. It is one of the most outstanding 🚀 achievements in Machine Learning 🧠 and has many practical applications.

For time series forecasting, the technique allows you to get lightning-fast predictions ⚡ bypassing the tradeoff between accuracy and speed.

[This notebook](https://colab.research.google.com/drive/1uFCO2UBpH-5l2fk3KmxfU0oupsOC6v2n?authuser=0&pli=1#cell-5=) shows how to generate a pre-trained model and store it in a checkpoint to make it available for public use to forecast new time series never seen by the model. 
If you want to see a proof of concept in action you can visit this [Demo](http://nixtla.io/transfer-learning/).

If you want to use our [Low Latency API](https://docs.nixtla.io/reference/forecast_forecast_post) for forecasting you can SingUp [here](http://18.235.133.135:3000/login). 

**You can contribute with your pre-trained models by following [this Notebook](https://github.com/Nixtla/transfer-learning-time-series/blob/main/nbs/Transfer_Learning.ipynb) and sending us an email at azul[at]nixtla.io**

You can also take a look at list of pretrained models here.  Currently we have this ones avaiable in our [API](https://docs.nixtla.io/reference/neural_transfer_neural_transfer_post) or [Demo](http://nixtla.io/transfer-learning/). You can also download the `.ckpt`:
- [Pretrained N-HiTS M4 Hourly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nhits_m4_hourly.ckpt)
- [Pretrained N-HiTS M4 Hourly (Tiny)](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nhits_m4_hourly_tiny.ckpt)
- [Pretrained N-HiTS M4 Daily](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nhits_m4_daily.ckpt)
- [Pretrained N-HiTS M4 Monthly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nhits_m4_monthly.ckpt)
- [Pretrained N-HiTS M4 Yearly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nhits_m4_yearly.ckpt)
- [Pretrained N-BEATS M4 Hourly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nbeats_m4_hourly.ckpt)
- [Pretrained N-BEATS M4 Daily](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nbeats_m4_daily.ckpt)
- [Pretrained N-BEATS M4 Weekly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nbeats_m4_weekly.ckpt)
- [Pretrained N-BEATS M4 Monthly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nbeats_m4_monthly.ckpt)
- [Pretrained N-BEATS M4 Yearly](https://nixtla-public.s3.amazonaws.com/transfer/pretrained_models/nbeats_m4_yearly.ckpt)

See how to load and use the pretrained models in [this Notebook](https://github.com/Nixtla/transfer-learning-time-series/blob/main/nbs/Transfer_Learning.ipynb).
If you want us to include more model or train some private ones in your own data, contact us at: azul@nixtla.io.

If you are interested in the transfer learning literature, take a look at this paper:
- [Meta-learning framework with applications to zero-shot time-series forecasting](https://arxiv.org/abs/2002.02887)
- [N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting](https://arxiv.org/abs/2201.12886)
