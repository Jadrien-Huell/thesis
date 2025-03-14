import Combination

comboComponents = Combination.createElementVariations(["A", "B", "C"]) #This creates the components from each element
combinations = Combination.createCombosV2(comboComponents) # This creates unique combinations

print(f"Components:{comboComponents}\n Combonations:\n\n")

for x in range(0, len(combinations)):
    if (x%len(comboComponents)) == 0:
        print("")
    print(combinations[x])