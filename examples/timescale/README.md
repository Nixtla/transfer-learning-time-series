# Upload data

1. Follow the instructions [here](https://docs.influxdata.com/influxdb/cloud/tools/influx-cli/) to download `telegraf` and configure it.
2. Run the following,

```bash
influx write -b <%= bucket %> -f datasets/air_passengers.csv
```
