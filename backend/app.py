from flask import Flask, jsonify, request
from github import Github
from pyquery import PyQuery
import requests

app = Flask(__name__)

@app.route('/', methods=['GET'])
def main():
    return jsonify({"status": "OK", "message": "hello flat"}), 200


if __name__ == '__main__':
    app.run()