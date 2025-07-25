# import numpy as np
# import pandas as pd

# def generate_sample(n=500):
#     samples = []
#     labels = []

#     for _ in range(n):
#         total_txns = np.random.randint(50, 500)
#         successful_txns = np.random.randint(int(0.8 * total_txns), total_txns)
#         refund_count = np.random.randint(0, int(0.2 * total_txns))
#         chargeback_count = np.random.randint(0, int(0.1 * total_txns))
#         sales_amt = np.random.randint(5000, 100000)
#         refund_amt = refund_count * np.random.randint(100, 1000)
#         chargeback_amt = chargeback_count * np.random.randint(500, 2000)

#         # Derived features
#         refund_ratio = refund_count / total_txns
#         chargeback_ratio = chargeback_count / total_txns
#         refund_amt_ratio = refund_amt / sales_amt
#         chargeback_amt_ratio = chargeback_amt / sales_amt

#         features = [
#             refund_ratio,
#             chargeback_ratio,
#             refund_amt_ratio,
#             chargeback_amt_ratio,
#             refund_count,
#             chargeback_amt
#         ]
#         samples.append(features)

#         # Rule-based labeling (you can customize this logic)
#         label = 1 if (refund_ratio > 0.1 or chargeback_ratio > 0.05 or chargeback_amt > 3000) else 0
#         labels.append(label)

#     return samples, labels

# # Generate data
# X, y = generate_sample(500)

# # Save to CSV
# df = pd.DataFrame(X, columns=[
#     "refund_ratio", "chargeback_ratio",
#     "refund_amt_ratio", "chargeback_amt_ratio",
#     "refund_count", "chargeback_amt"
# ])
# df["label"] = y

# # Export
# df.to_csv("transaction_data.csv", index=False)
# print("✅ CSV file generated: transaction_data.csv")














# import csv
# import random

# NUM_SAMPLES = 100 # 👈 Set how many rows you want

# header = [
#     "refund_rate_count", "chargeback_rate_count",
#     "refund_rate_amt", "chargeback_rate_amt",
#     "successful_sales_count", "total_sales_amount",
#     "label"
# ]

# def generate_sample():
#     # Generate features
#     successful_sales_count = random.randint(1, 1000)
#     total_sales_amount = successful_sales_count * random.uniform(50, 500)  # avg sale ₹50–₹500

#     refund_count = random.randint(0, int(successful_sales_count * 0.5))  # up to 50% refunds
#     chargeback_count = random.randint(0, int(successful_sales_count * 0.3))  # up to 30% chargebacks

#     refund_amt = refund_count * random.uniform(50, 500)
#     chargeback_amt = chargeback_count * random.uniform(50, 500)

#     refund_rate_count = refund_count / successful_sales_count
#     chargeback_rate_count = chargeback_count / successful_sales_count
#     refund_rate_amt = refund_amt / total_sales_amount
#     chargeback_rate_amt = chargeback_amt / total_sales_amount

#     # Label: 1 = good, 0 = fraud (based on thresholds)
#     if chargeback_rate_count > 0.2 or chargeback_rate_amt > 0.3:
#         label = 0  # likely fraud
#     else:
#         label = 1  # good

#     return [
#         round(refund_rate_count, 4),
#         round(chargeback_rate_count, 4),
#         round(refund_rate_amt, 4),
#         round(chargeback_rate_amt, 4),
#         successful_sales_count,
#         round(total_sales_amount, 2),
#         label
#     ]

# # Write to CSV
# with open("training_data.csv", "w", newline="") as f:
#     writer = csv.writer(f)
#     writer.writerow(header)

#     for _ in range(NUM_SAMPLES):
#         writer.writerow(generate_sample())

# print(f"✅ {NUM_SAMPLES} rows of training data written to training_data.csv")


















import csv
import random

NUM_SAMPLES = 10  # 🔢 Number of random samples to generate

header = [
    "refund_rate_count", "chargeback_rate_count",
    "refund_rate_amt", "chargeback_rate_amt",
    "successful_sales_count", "total_sales_amount",
    "label"  # 1 = good, 2 = review, 0 = fraud
]

def generate_sample():
    total_sales_count = random.randint(10, 1000)
    successful_sales_count = total_sales_count  # assuming all successful for training
    total_sales_amount = successful_sales_count * random.uniform(50, 500)

    refund_count = random.randint(0, int(total_sales_count * 0.4))
    chargeback_count = random.randint(0, int(total_sales_count * 0.3))

    refund_amount = refund_count * random.uniform(50, 500)
    chargeback_amount = chargeback_count * random.uniform(50, 500)

    refund_rate_count = refund_count / total_sales_count if total_sales_count else 0
    chargeback_rate_count = chargeback_count / total_sales_count if total_sales_count else 0
    refund_rate_amt = refund_amount / total_sales_amount if total_sales_amount else 0
    chargeback_rate_amt = chargeback_amount / total_sales_amount if total_sales_amount else 0

    # 🎯 Label logic
    if chargeback_rate_count > 0.2 or chargeback_rate_amt > 0.3:
        label = 0  # fraud
    elif chargeback_rate_count > 0.1 or chargeback_rate_amt > 0.1:
        label = 2  # review
    else:
        label = 1  # good

    return [
        round(refund_rate_count, 4),
        round(chargeback_rate_count, 4),
        round(refund_rate_amt, 4),
        round(chargeback_rate_amt, 4),
        successful_sales_count,
        round(total_sales_amount, 2),
        label
    ]

# 📄 Write CSV
with open("training_data.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(header)

    for _ in range(NUM_SAMPLES):
        writer.writerow(generate_sample())

    # 📌 Add edge cases
    # header = ["refund_rate_count","chargeback_rate_count","refund_rate_amt","chargeback_rate_amt","successful_sales_count","total_sales_amount","label"]

    edge_cases = [
        [0.0, 0.2, 0.0, 0.15, 15, 15000.0, 2],  # borderline: review
        [0.0, 0.3, 0.0, 0.35, 10, 8000.0, 0],   # fraud case
        [0.05, 0.05, 0.02, 0.05, 100, 30000.0, 1],  # good case
        [0.0, 0.2, 0.0, 0.15, 15, 15000.0, 2],  # borderline: review
        [0.0, 0.3, 0.0, 0.35, 10, 8000.0, 0],   # fraud case
        [0.05, 0.05, 0.02, 0.05, 100, 30000.0, 1],  # good case
        [0.0, 0.25, 0.0, 0.20, 18, 18000.0, 2],  # review: moderate chargeback
        [0.01, 0.28, 0.01, 0.28, 20, 20000.0, 2],  # review: borderline fraud
        [0.0, 0.15, 0.0, 0.10, 12, 12000.0, 2],  # review: light chargeback
        [0.0, 0.33, 0.0, 0.30, 14, 14000.0, 2],  # review: high but not fraud
        [0.02, 0.22, 0.01, 0.18, 16, 16000.0, 2],  # review: edge
        [0.0, 0.29, 0.0, 0.29, 13, 13000.0, 2],  # review: just below fraud
        [0.0, 0.35, 0.0, 0.40, 8, 9000.0, 0],    # fraud: high chargeback
        [0.02, 0.38, 0.02, 0.30, 11, 8500.0, 0],  # fraud: refund + chargeback
        [0.0, 0.40, 0.0, 0.45, 9, 7000.0, 0],    # fraud: extreme chargeback
        [0.0, 0.10, 0.0, 0.08, 50, 25000.0, 1],  # good: high volume low issues
        [0.01, 0.12, 0.01, 0.10, 60, 27000.0, 1],  # good: some issues but safe
        [0.05, 0.20, 0.05, 0.20, 20, 20000.0, 2],  # review: mixed signals
        [0.00, 0.26, 0.00, 0.18, 12, 12000.0, 2],  # review
        [0.01, 0.31, 0.01, 0.30, 22, 22000.0, 2],  # review
        [0.04, 0.05, 0.01, 0.02, 45, 16000.0, 1],  # good: high volume small issues
        [0.02, 0.50, 0.00, 0.48, 9, 8500.0, 0],    # fraud: too many disputes
        [0.00, 0.07, 0.00, 0.03, 80, 28000.0, 1],  # good: very clean
        [0.0, 0.21, 0.0, 0.14, 15, 14900.0, 2],  # just slightly worse chargeback rate
        [0.0, 0.19, 0.0, 0.16, 16, 15100.0, 2],  # better chargeback, slightly higher amount
        [0.01, 0.20, 0.0, 0.15, 14, 14800.0, 2],  # small refund presence
        [0.0, 0.22, 0.0, 0.17, 15, 15000.0, 2],  # creeping into fraud risk
        [0.0, 0.18, 0.0, 0.14, 17, 16000.0, 2],  # safer but still borderline
        [0.01, 0.23, 0.01, 0.18, 15, 14500.0, 2],  # both refund and chargeback slightly high
        [0.0, 0.24, 0.0, 0.15, 13, 14700.0, 2],  # higher chargeback rate, lower volume
        [0.0, 0.2, 0.0, 0.16, 12, 14000.0, 2],   # same chargeback rate, higher amount ratio
        [0.02, 0.19, 0.01, 0.15, 15, 15000.0, 2],  # refund creeping in
        [0.0, 0.2, 0.0, 0.17, 16, 15300.0, 2],    # borderline with slightly higher $ impact
    ]
    for row in edge_cases:
        writer.writerow(row)

print(f"✅ {NUM_SAMPLES + len(edge_cases)} rows written to training_data.csv")
