import pandas as pd

# We need to drop PJM dataset as it containts two load columns, whereas the others contain a load AND a generation column
datasets = {
             "DE": {"Unnamed: 0": "ds",
                   "Price": "y",
                   "Ampirion Load Forecast": "Exogenous1",
                   "PV+Wind Forecast": "Exogenous2",
                   },
             "FR": {"Date": "ds",
                   " Prices": "y",
                   " System load forecast": "Exogenous1",
                   " Generation forecast": "Exogenous2",
                   },
             "NP": {"Date": "ds",
                   " Price": "y",
                   " Grid load forecast": "Exogenous1",
                   " Wind power forecast": "Exogenous2",
                   },
             "BE": {"Date": "ds",
                   " Prices": "y",
                   " System load forecast": "Exogenous1",
                   " Generation forecast": "Exogenous2",
                   },               
        }
                   
dfs_market = []
for name, column_names in datasets.items():
    df_market = pd.read_csv(f"https://zenodo.org/records/4624805/files/{name}.csv?download=1")
    df_market = df_market.rename(columns=column_names)
    df_market["unique_id"] = name
    dfs_market.append(df_market)

df = pd.concat(dfs_market)
df["ds"] = pd.to_datetime(df["ds"])
df = df[["unique_id", "ds", "y", "Exogenous1", "Exogenous2"]]
df = df.sort_values(by=["unique_id", "ds"], ignore_index=True)
df_day = pd.get_dummies(df["ds"].dt.day_of_week, prefix="day", dtype=float)
df = pd.concat([df, df_day], axis=1)

# Full version
df[["unique_id", "ds", "y"]].to_csv("datasets/electricity.csv", index=False)
df.drop(columns="y").to_csv("datasets/exogenous-vars-electricity.csv", index=False)

# Splitting the dataset into past and future for exogenous for the short version
n_days_short = 71
df_short = df.groupby("unique_id", as_index=False).tail(n_days_short * 24)
future_ex_vars_df = df_short.drop(columns="y").groupby("unique_id").tail(24)
df_short = df_short.drop(future_ex_vars_df.index)

df_short.to_csv("datasets/electricity-short-with-ex-vars.csv", index=False)
df_short[["unique_id", "ds", "y"]].to_csv("datasets/electricity-short.csv", index=False)
future_ex_vars_df.to_csv("datasets/electricity-short-future-ex-vars.csv", index=False)