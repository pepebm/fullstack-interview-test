from flask import Flask, jsonify, request
from github import Github
from pyquery import PyQuery
from dotenv import load_dotenv, find_dotenv
from os import getenv
import requests

load_dotenv(find_dotenv(), verbose=True)

app = Flask(__name__)

@app.route('/', methods=['GET'])
def main():
    return jsonify({"status": "OK", "message": "hello flat"}), 200

port = getenv('PORT')
gh_key = getenv('GH_KEY')

if __name__ == '__main__':
    if gh_key != None:
		app.run(port=port if port != None else 8000)
	else:
		print("Error env GH_KEY missing.")