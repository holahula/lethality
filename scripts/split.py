import json

cards = json.loads(open('/Users/austinjiang/Documents/git/personal/lethality/scripts/cards.json').read())

print(len(cards))
# print(cards[0])

for card in cards:
    print(card)

    filename = "/Users/austinjiang/Documents/git/personal/lethality/scripts/cards/"+ card["cardCode"] + ".json"

    with open(filename, 'w') as f:
        json.dump(card, f)
