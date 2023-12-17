import matplotlib.pyplot as plt
import pandas as pd
import json

df = pd.read_json("./roll-data.json")
df = pd.json_normalize(df["servant"])
df

rarity_counts = df["sv_rarity"].value_counts().sort_index()
print("Rarity Counts\n", rarity_counts)

# Plot a bar graph with respect to Rarity
rarity_counts.plot(kind="bar")
plt.xlabel("Rarity")
plt.ylabel("Number of Appearances")
plt.title("Number of Appearances for Each Rarity")
plt.xticks(rotation=0)  # Rotate x-axis labels for better visibility
plt.tight_layout()

# Show the plot
plt.show()
