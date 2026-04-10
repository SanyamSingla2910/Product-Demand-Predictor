import pandas as pd
import numpy as np

np.random.seed(42)

n_samples = 10000

seasons = np.random.choice(["Winter", "Summer", "Monsoon", "Spring", "Autumn"], size=n_samples)
categories = np.random.choice(["Shoes", "Books", "Electronics", "Clothing", "Software"], size=n_samples)

marketing_budget = np.random.normal(500, 150, size=n_samples).clip(100, 1000)

price_base = []
for c in categories:
    if c == "Shoes": price_base.append(np.random.normal(120, 20))
    elif c == "Books": price_base.append(np.random.normal(30, 10))
    elif c == "Electronics": price_base.append(np.random.normal(500, 100))
    elif c == "Clothing": price_base.append(np.random.normal(60, 15))
    elif c == "Software": price_base.append(np.random.normal(200, 50))
price = np.array(price_base).clip(10, 1500)

competitor_price = price + np.random.normal(5, 15, size=n_samples)
competitor_price = competitor_price.clip(10, 1500)
economic_index = np.random.uniform(0.5, 1.5, size=n_samples)

base_demand = 2000
price_effect = -5 * price
marketing_effect = 8 * marketing_budget
competitor_effect = 5 * competitor_price
eco_effect = 500 * economic_index

season_effect = []
for s in seasons:
    if s == "Winter": season_effect.append(400)
    elif s == "Summer": season_effect.append(-200)
    elif s == "Monsoon": season_effect.append(100)
    elif s == "Spring": season_effect.append(300)
    else: season_effect.append(0)

cat_effect = []
for c in categories:
    if c == "Shoes": cat_effect.append(1000)
    elif c == "Books": cat_effect.append(3000)
    elif c == "Electronics": cat_effect.append(500)
    elif c == "Clothing": cat_effect.append(2500)
    elif c == "Software": cat_effect.append(1500)

season_effect = np.array(season_effect)
cat_effect = np.array(cat_effect)

noise = np.random.normal(0, 300, size=n_samples)

demand = base_demand + price_effect + marketing_effect + competitor_effect + eco_effect + season_effect + cat_effect + noise
demand = demand.clip(50, 20000).astype(int)

df = pd.DataFrame({
    "product_category": categories,
    "marketing": np.round(marketing_budget, 2),
    "price": np.round(price, 2),
    "competitor_price": np.round(competitor_price, 2),
    "economic_index": np.round(economic_index, 2),
    "season": seasons,
    "demand": demand
})

df.to_csv("dataset.csv", index=False)
