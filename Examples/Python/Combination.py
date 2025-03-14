import math

def createElementVariations(elements):
    variations = []
    for element in elements:
        variant = []
        for x in range(0, 2):
            variant.append(element + str(x))
        variations.append(variant)
    return variations

def createNumericVariations(elements):
    variations = []
    for element in elements:
        variant = []
        for x in range(0, 3):
            variant.append(element + (x-1) * element * 0.05)
        variations.append(variant)
    return variations

# Benchmark testing (Pattern identifaction)
def createCombosV1():
    variations = createElementVariations(["A", "B", "C"])
    listOfCombinations = []
    count = {"A": 0, "B":0, "C":0}
    for a in variations[0]:
        count["A"] = 0
        for b in variations[1]:
            count["B"] = 0
            for c in variations[2]:
                count["C"] = 0
                combo = [a, b, c]
                listOfCombinations.append(combo)
                print(combo)
                for x in count:
                    count[x]+=1
        print('\n')
    print(f"{variations}\n# Of Combinations: {len(listOfCombinations)}\n{count}")
    return listOfCombinations

# Generates unique combinations
def createCombosV2(componentLists):
    repetitions = []
    listOfCombinations = []
    numberOfCombos = 1

    # Gets total number of combinations
    for list in componentLists:
        numberOfCombos *= len(list)

    # Gets total number of reps before a set
    product = numberOfCombos
    for i in range(0, len(componentLists)):
        product /= len(componentLists[i])
        repetitions.insert(i, product)

    #print(numberOfCombos, repetitions,"\n")

    # Create unique combinations
    for i in range(0, numberOfCombos):
        combo = []
        for j in range(0, len(componentLists)):
            index = int(math.fmod(math.floor(i/repetitions[j]), len(componentLists[j])))
            combo.append(componentLists[j][index])
            #combo.append(index)
        listOfCombinations.append(combo)
        #print(f"{i+1}\t:{combo}")
    
    return listOfCombinations
    

#createCombosV1()
#createCombosV2(createElementVariations(["A", "B", "C"]))
# combo = createCombosV2(createElementVariations(["A", "B", "C"]))
# #print(createElementVariations(["A", "B", "C"]))

# print("\n"*2)
# for x in combo:
#     print(f"\t\t{combo.index(x)+1}. {x}")
# print("\n"*2)