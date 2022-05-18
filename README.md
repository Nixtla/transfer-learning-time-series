## Transfer learning for Time Series Forecasting
Transfer learning refers to the process of pre-training a flexible model on a large dataset and using it later on other data with little to no training. It is one of the most outstanding 🚀 achievements in Machine Learning 🧠 and has many practical applications.

For time series forecasting, the technique allows you to get lightning-fast predictions ⚡ bypassing the tradeoff between accuracy and speed (more than 30 times faster than our alreadsy fast [autoARIMA](https://github.com/Nixtla/statsforecast) for a similar accuracy).

This notebook shows how to generate a pre-trained model and store it in a checkpoint to make it available for public use to forecast new time series never seen by the model. 
If you want to see a proof of concept in action you can vistit this [Demo](http://nixtla.io/transfer_learning/)

If you want to use our [Low Latency API]([docs.nixtla.io/](https://docs.nixtla.io/reference/neural_transfer_neural_transfer_post)) for forecasting you can SingUp [here](nixtla.io/transfer-learning). 

**You can contribute with your pre-trained models by following [this Notebook](https://github.com/Nixtla/transfer-learning-time-series/edit/main/README.md) and sending us an email at federico[at]nixtla.io**

You can also take a look at list of pretrained models here. Currently we have this ones avaiable in our [API](https://docs.nixtla.io/reference/neural_transfer_neural_transfer_post) or [Demo](http://nixtla.io/transfer_learning/):
- Pretrained N-HiTS M4 Hourly
- Pretrained N-HiTS M4 Hourly (Tiny)
- Pretrained N-HiTS M4 Daily
- Pretrained N-HiTS M4 Monthly
- Pretrained N-HiTS M4 Yearly
- Pretrained N-BEATS M4 Hourly
- Pretrained N-BEATS M4 Daily
- Pretrained N-BEATS M4 Monthly
- Pretrained N-BEATS M4 Yearly

If you are interested in the transfer learning literature, take a look at this paper:
- [Meta-learning framework with applications to zero-shot time-series forecasting](https://arxiv.org/abs/2002.02887)
- [N-HiTS: Neural Hierarchical Interpolation for Time Series Forecasting](https://arxiv.org/abs/2201.12886)
