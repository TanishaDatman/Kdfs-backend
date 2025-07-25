# # train_model_from_db.py

# import pandas as pd
# import numpy as np
# from catboost import CatBoostClassifier
# import joblib
# import os

# # Simulate loading data from DB (replace this with actual DB fetch)
# def load_data_from_db():
#     data = [
#         {"refund_count": 1, "chargeback_count": 0, "refund_amount": 100, "chargeback_amount": 0,
#          "successful_sales_count": 20, "total_sales_amount": 10000, "total_sales_count": 21, "label": 1},

#         {"refund_count": 4, "chargeback_count": 2, "refund_amount": 500, "chargeback_amount": 300,
#          "successful_sales_count": 5, "total_sales_amount": 2000, "total_sales_count": 11, "label": 0},

#         # Add more samples from real DB
#     ]
#     return pd.DataFrame(data)

# def extract_features_labels(df):
#     df["refund_rate_count"] = df["refund_count"] / df["total_sales_count"]
#     df["chargeback_rate_count"] = df["chargeback_count"] / df["total_sales_count"]
#     df["refund_rate_amt"] = df["refund_amount"] / df["total_sales_amount"]
#     df["chargeback_rate_amt"] = df["chargeback_amount"] / df["total_sales_amount"]

#     features = df[[
#         "refund_rate_count",
#         "chargeback_rate_count",
#         "refund_rate_amt",
#         "chargeback_rate_amt",
#         "successful_sales_count",
#         "total_sales_amount"
#     ]]
#     labels = df["label"]
#     return features, labels

# def train_and_save_model():
#     df = load_data_from_db()
#     X, y = extract_features_labels(df)

#     model = CatBoostClassifier(
#         iterations=100,
#         learning_rate=0.1,
#         depth=4,
#         verbose=0,
#         random_seed=42
#     )

#     model.fit(X, y)

#     # Save model as .h5 using joblib
#     joblib.dump(model, "catboost_model.h5")
#     print("Model trained and saved as 'catboost_model.h5'")

# if __name__ == "__main__":
#     train_and_save_model()






















# train_model_from_db.py
# import pandas as pd
# import joblib
# from catboost import CatBoostClassifier

# # check
# CSV_PATH = "data/txn_dataset.csv"  

# def load_data_from_csv():
#     try:
#         df = pd.read_csv(CSV_PATH)
#         return df
#     except Exception as e:
#         print("Error loading CSV:", e)
#         return pd.DataFrame()

# def preprocess(df):
#     df["refund_rate_count"] = df["total_refunds"] / df["total_txn"]
#     df["chargeback_rate_count"] = df["total_chargebacks"] / df["total_txn"]
#     df["refund_rate_amt"] = df["total_refund_amount"] / df["total_sales"]
#     df["chargeback_rate_amt"] = df["total_chargeback_amount"] / df["total_sales"]

#     df.fillna(0, inplace=True)

#     features = df[[
#         "refund_rate_count",
#         "chargeback_rate_count",
#         "refund_rate_amt",
#         "chargeback_rate_amt",
#         "total_txn",
#         "total_sales",
#         "total_sale_amount",
#         "recent_txn_count"
#     ]]
#     labels = df["fraud_score"].apply(lambda x: 1 if x > 0.7 else 0)  # Binary label for classification

#     return features, labels

# def train_and_save_model():
#     df = load_data_from_csv()
#     if df.empty:
#         print("No data loaded. Exiting.")
#         return

#     X, y = preprocess(df)


# # check
#     model = CatBoostClassifier(
#         iterations=100,
#         learning_rate=0.1,
#         depth=4,
#         verbose=0,
#         random_seed=42
#     )
#     model.fit(X, y)

#     joblib.dump(model, "catboost_model.h5")
#     print("Model trained and saved as catboost_model.h5")

# if __name__ == "__main__":
#     train_and_save_model()









# isolation_forest_model code
# -*- coding: utf-8 -*-
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
import time




# Path to your CSV
# CSV_PATH = "data/txn_dataset.csv"
CSV_PATH = "../data/txn_dataset.csv"



def load_data_from_csv():
    try:
        df = pd.read_csv(CSV_PATH)
        return df
    except Exception as e:
        print("Error loading CSV:", e)
        return pd.DataFrame()

def preprocess(df):
    df["refund_rate_count"] = df["total_refunds"] / df["total_txn"]
    df["chargeback_rate_count"] = df["total_chargebacks"] / df["total_txn"]
    df["refund_rate_amt"] = df["total_refund_amount"] / df["total_sales"]
    df["chargeback_rate_amt"] = df["total_chargeback_amount"] / df["total_sales"]

    df.fillna(0, inplace=True)

    features = df[[
        "refund_rate_count",
        "chargeback_rate_count",
        "refund_rate_amt",
        "chargeback_rate_amt",
        "total_txn",
        "total_sales",
        "total_sale_amount",
        "recent_txn_count"
    ]]

    return features

def train_and_save_model():
    df = load_data_from_csv()
    if df.empty:
        print("No data loaded. Exiting.")
        return

    X = preprocess(df)

    # Isolation Forest
    model = IsolationForest(
        n_estimators=100,
        contamination=0.05,  # Adjust this based on expected % of frauds
        random_state=42,
        verbose=1 
    )
    # model.fit(X)

    start = time.time()
    model.fit(X)
    end = time.time()
    print(f"Training completed in {end - start:.2f} seconds")

    joblib.dump(model, "isolation_forest_model.pkl")
    print("Isolation Forest model trained and saved as isolation_forest_model.pkl")

if __name__ == "__main__":
    train_and_save_model()
