import sys
import requests
import numpy as np
import copy 
import random
import string
import pprint


def randomString(stringLength):
    """Generate a random string with the combination 
    of lowercase and uppercase letters """
    letters = string.ascii_letters
    return ''.join(random.choice(letters) for i in range(stringLength))


def createStudy(cards):
    numberOfLists = np.random.randint(low=2, high=len(cards) - 1)
    listOfCards = [[] for i in range(numberOfLists)]
    cardsFromTheStudy = copy.copy(cards)
    
    print("Generating a study with ", numberOfLists, " lists.")

    while(cardsFromTheStudy != []):

        if (len(cardsFromTheStudy) != 1):
            whichCard = np.random.randint(
                low=0, 
                high=len(cardsFromTheStudy) - 1)
        else:
            whichCard = 0
      
        listOfCards[np
                    .random
                    .randint(low=0, high=numberOfLists - 1)].append(
                        cardsFromTheStudy[whichCard])
        cardsFromTheStudy.pop(whichCard)
         
    return listOfCards

    
pp = pprint.PrettyPrinter(indent=4)
# Reading users inputs
numberOfDocuments = int(sys.argv[1])
studyId = sys.argv[2]

study = requests.get("http://localhost:3000/studies/_id=" + studyId)
study = study.json()

# Copying the cards to separate list
cards = study[0]['cards']

# This list will contain the studies we'll generate...
newStudies = []
currentDocuments = 0

# While we have not achieved the number of studies we wanted in the beginning
while(currentDocuments < numberOfDocuments):

    # Getting our board from our api...
    board = requests.get(f"http://localhost:3000/fetchBoard/_id={studyId}")
    board = board.json()
    boardId = board['_id']

    # Here we create a base study with no cards.
    newStudy = board

    del newStudy['_id']
    del newStudy['createdAt']
    del newStudy['updatedAt']
    del newStudy['__v']
    del newStudy['color']
    del newStudy['title']

    newStudy['valid'] = 'true'
    newStudy['lists'].clear()
    randomCards = createStudy(cards)
    for i in randomCards:
        newStudy['lists'].append({'cards': i, 'title': randomString(10)})
    print(">>> Dumped study: ")
    pp.pprint(newStudy)

    print(">>> How it was sent: ", {'lists': str(newStudy['lists']),
                                    'valid': newStudy['valid']})
    currentDocuments += 1

    url = 'http://localhost:3000/boards/_id=' + boardId

    requests.put(url, data={'lists': str(newStudy['lists']),
                            'valid': newStudy['valid']})

