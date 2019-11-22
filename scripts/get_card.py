import requests
import json

def get_card_data(id):
    r = requests.get("https://storage.googleapis.com/lethality/card_data/" + id + ".json")
    return r.json()

print(get_card_data("01DE003"))