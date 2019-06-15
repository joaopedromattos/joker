from requests import get, delete
import matplotlib.pyplot as plt
import numpy as np
import scipy.cluster.hierarchy as shc
import sys


# This function is used to filter the boards that we're 
# validated at the end of a participation.
def boardFilter(boards):
    # We'll save the ids of non-valid boards to remove 
    # them at the end of the function.
    stringIds = ""
    filteredBoards = []
    
    # Searching, in O(n), for non-valid boards.
    # We'll use this iterations to create a list of the valid boards
    for i in boards:
        if (i['valid'] is False):
            stringIds += str(i["_id"]) + ","
        else:
            filteredBoards.append(i)
    stringIds = stringIds[:-1]

    # filteredBoards = list(filter(lambda i: i['valid'] is True, boards))
    
    # Interacting with the data base through
    # our api to delete the non-valid boards.
    if (stringIds != ""):
        if (delete("http://localhost:3000/boards/_id=" + stringIds)):
            print("Deletion ok!")
        else:
            print("Something's gone wrong :(")
    else:
        print("There's nothing to delete...")
    
    return filteredBoards


studyId = sys.argv[1]

study = get("http://localhost:3000/studies/_id=" + studyId)
boards = get("http://localhost:3000/boards/studyId=" + studyId)

cards = study.json()[0]["cards"]


# print("Study get requisition result: ", study.json()[0]['cards'], "\n")

filteredBoards = boardFilter(boards.json())

lists = []

# We'll take the names of all cards
names = [i['name'] for i in cards] 

for i in filteredBoards:
    for j in i['lists']:
        if (len(j['cards']) != 0):
            lists.append(j)

# Creating a list that will store each observation vector.
observationVectors = np.zeros(shape=(len(lists), len(cards)), dtype=np.float)

# We'll these three fors in sequence
# to create the observation vector of each list.
# The estimated complexity is O(n**2)
for i, currentCard in enumerate(cards):
    for j, currentList in enumerate(lists):
        for k in currentList['cards']:
            if (currentCard['_id'] == k['_id']):
                observationVectors[j][i] = 1

# Generating and saving our plots...
plt.figure()
plt.title(study.json()[0]['name'])

dend = shc.dendrogram(shc.linkage(
                observationVectors.transpose(), 
                method='ward', 
                metric='euclidean'), 
                labels=names, 
                orientation='left')

plt.tight_layout()
plt.savefig('./statisticalModule/results/' + study.json()[0]['_id'])
plt.ioff()
# plt.show()
