# import sys

# import json
# import numpy as np
# from sklearn.ensemble import RandomForestClassifier

# # 🔁 Train model only once
# # Feature order:
# # refund_rate_count, chargeback_rate_count, refund_rate_amt, chargeback_rate_amt, successful_sales_count, total_sales_amount
# #     Example:
# #     [0.0, 0.0, 0.0, 0.0, 10, 10000]
# #      ↓    ↓    ↓    ↓     ↓     ↓
# #      a    b    c    d     e     f
# def train_model():
#     X = np.array([
#         [0.0, 0.0, 0.0, 0.0, 10, 10000],
#         [0.05, 0.01, 0.02, 0.01, 15, 8000],
#         [0.1, 0.03, 0.05, 0.02, 20, 15000],
#         [0.2, 0.07, 0.08, 0.04, 10, 5000],
#         [0.3, 0.1, 0.15, 0.06, 8, 3000],
#         [0.5, 0.2, 0.3, 0.12, 5, 1000],
#         [0.10, 0.033, 0.15, 0.375, 6, 1500]
#     ])
#     y = np.array([1, 1, 1, 0, 0, 0, 0])  # 1 = good, 0 = fraud
#     model = RandomForestClassifier(n_estimators=100, random_state=42)
#     model.fit(X, y)
#     return model

# # 🚀 Global model (loaded once)
# MODEL = train_model()

# def calculate_score(item):
#     total_sales_count = item.get("total_sales_count", 0)
#     total_sales_amount = item.get("total_sales_amount", 0)
#     refund_count = item.get("refund_count", 0)
#     chargeback_count = item.get("chargeback_count", 0)
#     refund_amount = item.get("refund_amount", 0)
#     chargeback_amount = item.get("chargeback_amount", 0)
#     successful_sales_count = item.get("successful_sales_count", 0)

#     refund_rate = refund_count / total_sales_count if total_sales_count else 0
#     chargeback_rate = chargeback_count / total_sales_count if total_sales_count else 0
#     refund_rate_amt = refund_amount / total_sales_amount if total_sales_amount else 0
#     chargeback_rate_amt = chargeback_amount / total_sales_amount if total_sales_amount else 0

#     score = item.get("fraud_score", 50)

#     # ⚠️ Penalties
#     score -= refund_rate * 5
#     score -= refund_rate_amt * 5
#     score -= chargeback_rate * 20
#     score -= chargeback_rate_amt * 30

#     # ✅ Rewards
#     if refund_rate < 0.1 and chargeback_rate < 0.02:
#         score += successful_sales_count * 0.75
#         score += min(total_sales_amount, 10000) * 0.001

#     return max(0, min(score, 100))


# def main():
#     collections = json.loads(sys.stdin.read())
#     results = []

#     for item in collections:
#         score = calculate_score(item)

#         refund_rate_count = item["refund_count"] / item["total_sales_count"] if item["total_sales_count"] else 0
#         chargeback_rate_count = item["chargeback_count"] / item["total_sales_count"] if item["total_sales_count"] else 0
#         refund_rate_amt = item["refund_amount"] / item["total_sales_amount"] if item["total_sales_amount"] else 0
#         chargeback_rate_amt = item["chargeback_amount"] / item["total_sales_amount"] if item["total_sales_amount"] else 0

#         features = [
#             refund_rate_count,
#             chargeback_rate_count,
#             refund_rate_amt,
#             chargeback_rate_amt,
#             item.get("successful_sales_count", 0),
#             item.get("total_sales_amount", 0)
#         ]

#         # Predict fraud risk
#         ml_pred = MODEL.predict([features])[0]
#         sys.stderr.write(f"ml_pred: {ml_pred}\n")
#         sys.stderr.write(f"score: {score}\n")

#         # Final decision based on both model and rule score
#         if ml_pred == 0 and score < 40:
#             final_status = "d"  # Decline
#         elif score < 60:
#             final_status = "r"  # Review
#         else:
#             final_status = "a"  # Approve

#         results.append({
#             "id": item["id"],
#             "score": round(score, 2),
#             "layer2_status": final_status
#         })

#     print(json.dumps(results))


# if __name__ == "__main__":
#     main()





# -----------------------------

# layer_2.py
# import os
# import sys
# import json
# import csv
# import numpy as np
# from sklearn.ensemble import RandomForestClassifier

# # 🧠 Train model from CSV file
# def train_model_from_csv():
#     path = os.path.join(os.path.dirname(__file__), "training_data.csv")
#     X = []
#     y = []
#     with open(path, newline='') as file:
#         reader = csv.DictReader(file)
#         for row in reader:
#             features = [
#                 float(row["refund_rate_count"]),
#                 float(row["chargeback_rate_count"]),
#                 float(row["refund_rate_amt"]),
#                 float(row["chargeback_rate_amt"]),
#                 float(row["successful_sales_count"]),
#                 float(row["total_sales_amount"]),
#             ]
#             label = int(row["label"])
#             X.append(features)
#             y.append(label)
#     model = RandomForestClassifier(n_estimators=100, random_state=42)
#     model.fit(X, y)
#     return model

# # 🌍 Load model globally
# MODEL = train_model_from_csv()

# # 🧮 Manual rule-based score calculator
# def calculate_score(item):
#     total_sales_count = item.get("total_sales_count", 0)
#     total_sales_amount = item.get("total_sales_amount", 0)
#     refund_count = item.get("refund_count", 0)
#     chargeback_count = item.get("chargeback_count", 0)
#     refund_amount = item.get("refund_amount", 0)
#     chargeback_amount = item.get("chargeback_amount", 0)
#     successful_sales_count = item.get("successful_sales_count", 0)

#     refund_rate = refund_count / total_sales_count if total_sales_count else 0
#     chargeback_rate = chargeback_count / total_sales_count if total_sales_count else 0
#     refund_rate_amt = refund_amount / total_sales_amount if total_sales_amount else 0
#     chargeback_rate_amt = chargeback_amount / total_sales_amount if total_sales_amount else 0

#     score = item.get("fraud_score", 50)

#     score -= refund_rate * 5
#     score -= refund_rate_amt * 5
#     score -= chargeback_rate * 20
#     score -= chargeback_rate_amt * 30

#     if refund_rate < 0.1 and chargeback_rate < 0.02:
#         score += successful_sales_count * 0.75
#         score += min(total_sales_amount, 10000) * 0.001

#     return max(0, min(score, 100))

# # 🧩 Core logic
# def main():
#     collections = json.loads(sys.stdin.read())
#     results = []

#     for item in collections:
#         score = calculate_score(item)

#         total_sales_count = item.get("total_sales_count", 0)
#         total_sales_amount = item.get("total_sales_amount", 0)

#         refund_rate_count = item["refund_count"] / total_sales_count if total_sales_count else 0
#         chargeback_rate_count = item["chargeback_count"] / total_sales_count if total_sales_count else 0
#         refund_rate_amt = item["refund_amount"] / total_sales_amount if total_sales_amount else 0
#         chargeback_rate_amt = item["chargeback_amount"] / total_sales_amount if total_sales_amount else 0

#         features = [
#             refund_rate_count,
#             chargeback_rate_count,
#             refund_rate_amt,
#             chargeback_rate_amt,
#             item.get("successful_sales_count", 0),
#             item.get("total_sales_amount", 0)
#         ]

#         ml_pred = MODEL.predict([features])[0]
#         sys.stderr.write(f"ml_pred: {ml_pred}\n")
#         sys.stderr.write(f"score: {score}\n")

#         if ml_pred == 0 and score < 40:
#             final_status = "d"
#         elif score < 60:
#             final_status = "r"
#         else:
#             final_status = "a"

#         results.append({
#             "id": item["id"],
#             "score": round(score, 2),
#             "layer2_status": final_status
#         })

#     print(json.dumps(results))


# if __name__ == "__main__":
#     main()



# ===============================















# catboost model
# import sys
# import json
# import numpy as np
# from catboost import CatBoostClassifier

# # 🔁 Train CatBoost model only once
# # Feature order:
# # refund_rate_count, chargeback_rate_count, refund_rate_amt, chargeback_rate_amt, successful_sales_count, total_sales_amount
# def train_model():
#     X = np.array([
#         [0.0, 0.0, 0.0, 0.0, 10, 10000],
#         [0.05, 0.01, 0.02, 0.01, 15, 8000],
#         [0.1, 0.03, 0.05, 0.02, 20, 15000],
#         [0.2, 0.07, 0.08, 0.04, 10, 5000],
#         [0.3, 0.1, 0.15, 0.06, 8, 3000],
#         [0.5, 0.2, 0.3, 0.12, 5, 1000]
#     ])
#     y = np.array([1, 1, 1, 0, 0, 0])  # 1 = good, 0 = fraud

#     model = CatBoostClassifier(
#         iterations=100,
#         learning_rate=0.1,
#         depth=4,
#         verbose=0,
#         random_seed=42
#     )

#     model.fit(X, y)
#     return model

# # 🚀 Global model
# MODEL = train_model()

# def calculate_score(item):
#     total_sales_count = item.get("total_sales_count", 0)
#     total_sales_amount = item.get("total_sales_amount", 0)
#     refund_count = item.get("refund_count", 0)
#     chargeback_count = item.get("chargeback_count", 0)
#     refund_amount = item.get("refund_amount", 0)
#     chargeback_amount = item.get("chargeback_amount", 0)
#     successful_sales_count = item.get("successful_sales_count", 0)

#     refund_rate = refund_count / total_sales_count if total_sales_count else 0
#     chargeback_rate = chargeback_count / total_sales_count if total_sales_count else 0
#     refund_rate_amt = refund_amount / total_sales_amount if total_sales_amount else 0
#     chargeback_rate_amt = chargeback_amount / total_sales_amount if total_sales_amount else 0

#     score = item.get("fraud_score", 50)

#     # ⚠️ Penalties
#     score -= refund_rate * 5
#     score -= refund_rate_amt * 5
#     score -= chargeback_rate * 20
#     score -= chargeback_rate_amt * 30

#     # ✅ Rewards
#     if refund_rate < 0.1 and chargeback_rate < 0.02:
#         score += successful_sales_count * 0.75
#         score += min(total_sales_amount, 10000) * 0.001

#     return max(0, min(score, 100))


# def main():
#     collections = json.loads(sys.stdin.read())
#     results = []

#     for item in collections:
#         score = calculate_score(item)

#         refund_rate_count = item["refund_count"] / item["total_sales_count"] if item["total_sales_count"] else 0
#         chargeback_rate_count = item["chargeback_count"] / item["total_sales_count"] if item["total_sales_count"] else 0
#         refund_rate_amt = item["refund_amount"] / item["total_sales_amount"] if item["total_sales_amount"] else 0
#         chargeback_rate_amt = item["chargeback_amount"] / item["total_sales_amount"] if item["total_sales_amount"] else 0

#         features = [
#             refund_rate_count,
#             chargeback_rate_count,
#             refund_rate_amt,
#             chargeback_rate_amt,
#             item.get("successful_sales_count", 0),
#             item.get("total_sales_amount", 0)
#         ]

#         # Predict fraud risk
#         ml_pred = MODEL.predict([features])[0]

#         # Final decision
#         if ml_pred == 0 and score < 40:
#             final_status = "d"  # Decline
#         else:
#             final_status = "a"  # Approve

#         results.append({
#             "id": item["id"],
#             "score": round(score, 2),
#             "layer2_status": final_status
#         })

#     print(json.dumps(results))


# if __name__ == "__main__":
#     main()






# # catboost updated model saving
# # layer2_predictor.py
# import os
# import sys
# import json
# import numpy as np
# import joblib

# # Load model from file
# # check
# # MODEL = joblib.load("./isolation_forest_model.pkl")
# model_path = os.path.join(os.path.dirname(__file__), 'isolation_forest_model.pkl')
# MODEL = joblib.load(model_path)

# def calculate_score(item):
#     total_sales_count = item.get("total_sales_count", 0)
#     total_sales_amount = item.get("total_sales_amount", 0)
#     refund_count = item.get("refund_count", 0)
#     chargeback_count = item.get("chargeback_count", 0)
#     refund_amount = item.get("refund_amount", 0)
#     chargeback_amount = item.get("chargeback_amount", 0)
#     successful_sales_count = item.get("successful_sales_count", 0)

#     refund_rate = refund_count / total_sales_count if total_sales_count else 0
#     chargeback_rate = chargeback_count / total_sales_count if total_sales_count else 0
#     refund_rate_amt = refund_amount / total_sales_amount if total_sales_amount else 0
#     chargeback_rate_amt = chargeback_amount / total_sales_amount if total_sales_amount else 0

#     score = item.get("fraud_score", 50)

#     # ⚠️ Penalties
#     score -= refund_rate * 5
#     score -= refund_rate_amt * 5
#     score -= chargeback_rate * 20
#     score -= chargeback_rate_amt * 30

#     # ✅ Rewards
#     if refund_rate < 0.1 and chargeback_rate < 0.02:
#         score += successful_sales_count * 0.75
#         score += min(total_sales_amount, 10000) * 0.001

#     return max(0, min(score, 100))

# def main():
#     collections = json.loads(sys.stdin.read())
#     results = []

#     for item in collections:
#         score = calculate_score(item)

#         total_sales_count = item.get("total_sales_count", 0)
#         total_sales_amount = item.get("total_sales_amount", 0)

#         refund_rate_count = item.get("refund_count", 0) / total_sales_count if total_sales_count else 0
#         chargeback_rate_count = item.get("chargeback_count", 0) / total_sales_count if total_sales_count else 0
#         refund_rate_amt = item.get("refund_amount", 0) / total_sales_amount if total_sales_amount else 0
#         chargeback_rate_amt = item.get("chargeback_amount", 0) / total_sales_amount if total_sales_amount else 0
# import sys
# import json
# import numpy as np
# import joblib

# # Load model from file
# # check
# MODEL = joblib.load("catboost_model.h5")

# def calculate_score(item):
#     total_sales_count = item.get("total_sales_count", 0)
#     total_sales_amount = item.get("total_sales_amount", 0)
#     refund_count = item.get("refund_count", 0)
#     chargeback_count = item.get("chargeback_count", 0)
#     refund_amount = item.get("refund_amount", 0)
#     chargeback_amount = item.get("chargeback_amount", 0)
#     successful_sales_count = item.get("successful_sales_count", 0)

#     refund_rate = refund_count / total_sales_count if total_sales_count else 0
#     chargeback_rate = chargeback_count / total_sales_count if total_sales_count else 0
#     refund_rate_amt = refund_amount / total_sales_amount if total_sales_amount else 0
#     chargeback_rate_amt = chargeback_amount / total_sales_amount if total_sales_amount else 0

#     score = item.get("fraud_score", 50)

#     # ⚠️ Penalties
#     score -= refund_rate * 5
#     score -= refund_rate_amt * 5
#     score -= chargeback_rate * 20
#     score -= chargeback_rate_amt * 30

#     # ✅ Rewards
#     if refund_rate < 0.1 and chargeback_rate < 0.02:
#         score += successful_sales_count * 0.75
#         score += min(total_sales_amount, 10000) * 0.001

#     return max(0, min(score, 100))

# def main():
#     collections = json.loads(sys.stdin.read())
#     results = []

#     for item in collections:
#         score = calculate_score(item)

#         refund_rate_count = item["refund_count"] / item["total_sales_count"] if item["total_sales_count"] else 0
#         chargeback_rate_count = item["chargeback_count"] / item["total_sales_count"] if item["total_sales_count"] else 0
#         refund_rate_amt = item["refund_amount"] / item["total_sales_amount"] if item["total_sales_amount"] else 0
#         chargeback_rate_amt = item["chargeback_amount"] / item["total_sales_amount"] if item["total_sales_amount"] else 0

#         features = [
#             refund_rate_count,
#             chargeback_rate_count,
#             refund_rate_amt,
#             chargeback_rate_amt,
#             item.get("successful_sales_count", 0),
#             item.get("total_sales_amount", 0)
#         ]

#         # Predict fraud risk
#         ml_pred = MODEL.predict([features])[0]

#         # Final decision
#         if ml_pred == 0 and score < 40:
#             final_status = "d"  # Decline
#         else:
#             final_status = "a"  # Approve

#         results.append({
#             "id": item["id"],
#             "score": round(score, 2),
#             "layer2_status": final_status
#         })

#     print(json.dumps(results))

# if __name__ == "__main__":
#     main()






# import os
# import sys
# import json
# import csv
# from sklearn.ensemble import RandomForestClassifier

# # 🔁 Train model once globally
# def train_model_from_csv():
#     path = os.path.join(os.path.dirname(__file__), "training_data.csv")
#     X, y = [], []

#     print("📁 Reading training data from:", path, file=sys.stderr)

#     with open(path, newline='') as file:
#         reader = csv.DictReader(file)
#         for i, row in enumerate(reader):
#             X.append([
#                 float(row["refund_rate_count"]),
#                 float(row["chargeback_rate_count"]),
#                 float(row["refund_rate_amt"]),
#                 float(row["chargeback_rate_amt"]),
#                 float(row["successful_sales_count"]),
#                 float(row["total_sales_amount"]),
#             ])
#             y.append(int(row["label"]))
#             print(f"✅ Row {i+1} features: {X[-1]}, label: {y[-1]}", file=sys.stderr)

#     print("🚀 Training RandomForestClassifier...", file=sys.stderr)
#     model = RandomForestClassifier(n_estimators=100, random_state=42)
#     model.fit(X, y)
#     print("✅ Model training complete.", file=sys.stderr)
#     return model

# MODEL = train_model_from_csv()

# def main():
#     try:
#         items = json.loads(sys.stdin.read())
#         results = []

#         print(f"📥 Received {len(items)} input records.", file=sys.stderr)

#         for i, item in enumerate(items):
#             total_sales_count = item.get("total_sales_count", 0)
#             total_sales_amount = item.get("total_sales_amount", 0)

#             features = [
#                 item["refund_count"] / total_sales_count if total_sales_count else 0,
#                 item["chargeback_count"] / total_sales_count if total_sales_count else 0,
#                 item["refund_amount"] / total_sales_amount if total_sales_amount else 0,
#                 item["chargeback_amount"] / total_sales_amount if total_sales_amount else 0,
#                 item.get("successful_sales_count", 0),
#                 item.get("total_sales_amount", 0),
#             ]

#             print(f"🧮 Features for prediction {i+1}: {features}", file=sys.stderr)

#             ml_pred = MODEL.predict([features])[0]
#             label = "fraud" if ml_pred == 0 else "good"

#             results.append({
#                 "id": item["id"],
#                 "ml_prediction": label
#             })

#         # 👇 Final prediction result goes to stdout
#         print(json.dumps(results))  # Only this line goes to stdout

#     except Exception as e:
#         print(f"❌ Layer 2 error: {str(e)}", file=sys.stderr)
#         sys.exit(1)

# if __name__ == "__main__":
#     main()
















import os
import sys
import json
import csv
from sklearn.ensemble import RandomForestClassifier

# 🔁 Train model once globally
def train_model_from_csv():
    path = os.path.join(os.path.dirname(__file__), "training_data.csv")
    X, y = [], []

    print("📁 Reading training data from:", path, file=sys.stderr)

    with open(path, newline='') as file:
        reader = csv.DictReader(file)
        for i, row in enumerate(reader):
            X.append([
                float(row["refund_rate_count"]),
                float(row["chargeback_rate_count"]),
                float(row["refund_rate_amt"]),
                float(row["chargeback_rate_amt"]),
                float(row["successful_sales_count"]),
                float(row["total_sales_amount"]),
            ])
            y.append(int(row["label"]))
            print(f"✅ Row {i+1} features: {X[-1]}, label: {y[-1]}", file=sys.stderr)

    print("🚀 Training RandomForestClassifier...", file=sys.stderr)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    print("✅ Model training complete.", file=sys.stderr)
    return model

MODEL = train_model_from_csv()

def main():
    try:
        items = json.loads(sys.stdin.read())
        results = []

        print(f"📥 Received {len(items)} input records.", file=sys.stderr)

        for i, item in enumerate(items):
            total_sales_count = item.get("total_sales_count", 0)
            total_sales_amount = item.get("total_sales_amount", 0)

            # Feature vector
            features = [
                item["refund_count"] / total_sales_count if total_sales_count else 0,
                item["chargeback_count"] / total_sales_count if total_sales_count else 0,
                item["refund_amount"] / total_sales_amount if total_sales_amount else 0,
                item["chargeback_amount"] / total_sales_amount if total_sales_amount else 0,
                item.get("successful_sales_count", 0),
                item.get("total_sales_amount", 0),
            ]

            print(f"🧮 Features for prediction {i+1}: {features}", file=sys.stderr)

            ml_pred = MODEL.predict([features])[0]

            # Map numeric to string label
            if ml_pred == 0:
                label = "fraud"
            elif ml_pred == 2:
                label = "review"
            else:
                label = "good"

            results.append({
                "id": item["id"],
                "ml_prediction": label
            })

        # ✅ Output result
        print(json.dumps(results))

    except Exception as e:
        print(f"❌ Layer 2 error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
