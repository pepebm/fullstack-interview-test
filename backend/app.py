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


@app.route('/get_branch/<branch_name>', methods=['GET'])
def get_branch(branch_name):
    if branch_name:
        data = []
        base_url = f"https://github.com/{repo_name}/branch_commits/"
        branch = repo.get_branch(branch_name)
        for c in repo.get_commits(sha=branch_name, since=repo.created_at):
            commit = repo.get_commit(sha=c.sha)
            query = PyQuery(requests.get(base_url + c.sha).text)
            current_branch = query.find(".branch").text()
            if current_branch == branch_name:
                data.append({
                    "id": c.sha,
                    "message": commit.commit.message,
                    "author": commit.commit.author.email,
                    "name": commit.commit.author.name,
                    "timestamp": commit.commit.committer.date,
                    "stats": {
                        "adds": commit.stats.additions,
                        "delelets": commit.stats.deletions,
                        "total": commit.stats.total
                    }
                })
        return jsonify({"status": "OK", "commits": data, "count": len(data)}), 200
    else:
        return jsonify({"error": "missing name"}), 404


if __name__ == '__main__':
	app.run(port=port if port != None else 8000)
