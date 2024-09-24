import functions_framework
from openai import OpenAI
import requests
import json
from flask import jsonify
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = {REDACTED}
OPENAI_API_KEY=os.getenv("OPENAPI_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

def runBasicLLMTask(query):
    chat_completion = client.chat.completions.create(
    messages=[{ "role": "user", "content": query }],
    model="gpt-4",
    )
    return chat_completion.choices[0].message.content

def getDistance(addr_a, addr_b):
    endpoint = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins" : addr_a,
        "destinations" : addr_b,
        "key" : API_KEY,
        "units" : "imperial"
        }
    response = requests.get(endpoint, params=params)
    data = response.json()
    if data['status'] == 'OK': return data['rows'][0]['elements'][0]['distance']['text']
    return "??? miles"

def getDataFromSearchText(q, num = 4):
    endpoint = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.id,places.formattedAddress'
    }
    data = { 'textQuery': q }
    response = requests.post(endpoint, headers=headers, json=data)
    return [[x['displayName']['text'],x['id'],x['formattedAddress']] for x in response.json()['places'][:num]]

def getPhoto(pid):
    endpoint = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={pid}&fields=photos&key={API_KEY}"
    response = requests.get(endpoint)
    place_details = response.json()
    if "result" in place_details and "photos" in place_details["result"]:
        photo_reference = place_details["result"]["photos"][0]["photo_reference"]
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photoreference={photo_reference}&key={API_KEY}"
        return photo_url
    return None

def getReviewsFromID(pid):
    endpoint = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" + str(pid) + "&fields=reviews&key=" + API_KEY
    response = requests.get(endpoint)
    review_json = response.json()
    reviews = []
    try:
        for each_review in review_json['result']['reviews']:
            reviews.append([each_review['rating'], each_review['text']])
    except: pass
    return reviews

def aggregateReviews(reviews):
    ret_dict = {"pro1" : "NULL", "pro2" : "NULL", "con1" : "NULL", "con2" : "NULL" }
    try:
        avg = sum([x[0] for x in reviews])/len(reviews)
        combined_text = "".join(["Review: " + x[1] + " " for x in reviews])
        ai_prompt = "Your answer should be a JSON object. It should have the following keys: pro1, pro2, con1, con2. \
        The value of pro1 should be a 10 word or less good things about the business. \
        The value of pro2 should be another 10 word or less good thing about the business. \
        The value of con1 should be a 10 word or less negative of the business. \
        The value of con2 should be another 10 word or less negative of the business. \
        If there isn't enough information to conclude one of these values, make that value the string 'NULL'. \
        If the review is blank, or you don't have any reviews, then all values of the JSON should be the string 'NULL'. \
        Under no circumstances should your answer ever include more than just this JSON object. Never elaborate or explain it. \
        Base your summary on the following reviews: " + combined_text
        agg = runBasicLLMTask(ai_prompt)
        ret_dict = json.loads(agg)
        ret_dict['avg'] = avg
    except: pass
    return ret_dict

def generateJSON(origin, places):
    ret_dict = {}
    for i, each_place in enumerate(places):
        dist = getDistance(origin, each_place[2])
        revs = getReviewsFromID(each_place[1])
        agg = aggregateReviews(revs)
        agg['name'] = each_place[0]
        agg['distance'] = dist
        agg['photo'] = getPhoto(each_place[1])
        agg['address'] = each_place[2]
        if agg['photo'] == None: agg['photo'] = "NULL"
        ret_dict[str(i)] = agg
    return ret_dict

def runProcess(filter_value, addr, num = 4):
    places = getDataFromSearchText(filter_value + " near: " + addr, num)
    return generateJSON(addr, places)

@functions_framework.http
def serve(request):
    request_json = request.get_json(silent=True)
    request_args = request.args

    filter_value = None
    address_value = None

    if request_json:
        filter_value = request_json.get('filter')
        address_value = request_json.get('address')
    if request_args:
        filter_value = request_args.get('filter', filter_value)
        address_value = request_args.get('address', address_value)

    if filter_value and address_value:
        print(f'Filter: {filter_value}, Address: {address_value}')
        retval = runProcess(filter_value, address_value)
        print(retval)
        response = jsonify(retval)
    else:
        response = jsonify({'error': 'Missing filter or address parameter.'}), 400

    # Add CORS headers
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')

    return response
