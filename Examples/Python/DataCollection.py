"""
By: Jadrien Huell

This python file collects data loaded from Kaggle File
"""

import kagglehub
import pandas as pd
import os

csv_files = {}

# Download latest version
path = kagglehub.dataset_download("wyattowalsh/basketball")

for dirname, _, filenames in os.walk(path):
    for filename in filenames:
        fileDirectory = os.path.join(dirname, filename)
        fileInfo = filename.split(".")   
        
        if fileInfo[-1] == "csv":
            csv_files[fileInfo[0]] = fileDirectory

# Reading csv a file
data = pd.read_csv(csv_files["player"])
data = data.dropna() #Removing NaN values

# Tabulating row from csv
rowCount = 5
rows = []
for i in range(0, rowCount, 1):
    row_data = {}
    for x in range(0, len(data.columns), 1):
        row_data[data.columns[x]] = data.iloc[i].values[x]
    rows.append(row_data)

# Output
print("CSV Files:")
for key in csv_files:
    print("\t"+key)
print("\n"*2)

print("Data:\n")
for row in rows:
    print(row, "\n"*1) 