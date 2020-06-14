from flask import Flask, jsonify, request
from github import Github
from pyquery import PyQuery
from dotenv import load_dotenv, find_dotenv
from os import getenv
import requests

load_dotenv(find_dotenv(), verbose=True)
port = getenv('PORT')
gh_key = getenv('GH_KEY')

repo_name = 'pepebm/fullstack-interview-test'
app = Flask(__name__)
g = Github(gh_key)
repo = g.get_repo(repo_name)

@app.route('/branches', methods=['GET'])
def branches():
    data = [branch.name for branch in list(repo.get_branches())]
    return jsonify({"status": "OK", "branches": data}), 200


if __name__ == '__main__':
	app.run(port=port if port != None else 8000)