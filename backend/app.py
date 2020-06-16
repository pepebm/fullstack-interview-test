from flask import Flask, jsonify, request
from github import Github
from pyquery import PyQuery
from dotenv import load_dotenv, find_dotenv
from os import getenv
from flask_cors import CORS
from database.db import initialize_db
from database.models import Pr
import requests

# ENV Vars
load_dotenv(find_dotenv(), verbose=True)
port = getenv('PORT')
gh_key = getenv('GH_KEY')
repo_name = getenv('REPO_NAME')
db_pwd = getenv('DB_PWD')

# Flask config
app = Flask(__name__)
CORS(app)

# Database Connection
DB_URI = f"mongodb+srv://USRMONG:{db_pwd}>@flat-interview-5se22.mongodb.net/FLAT-INTERVIEW?retryWrites=true&w=majority"
app.config["MONGODB_HOST"] = DB_URI
initialize_db(app)

# Github Module Config
g = Github(gh_key)
repo = g.get_repo(repo_name)

@app.route('/repo', methods=['GET'])
def get_repo():
    try:
        return jsonify({"status": "OK", "name": repo_name}), 200
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400

@app.route('/branches', methods=['GET'])
def branches():
    try:
        branch_list = list(repo.get_branches())
        data = [branch.name for branch in branch_list]
        return jsonify({"status": "OK", "branches": data}), 200
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400

@app.route('/branches/get', methods=['POST'])
def get_branch():
    try:
        req_data = request.get_json()
        if 'name' in req_data:
            branch_name = req_data['name']
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
                        "url": commit.commit.html_url,
                        "stats": {
                            "adds": commit.stats.additions,
                            "deletes": commit.stats.deletions,
                            "total": commit.stats.total
                        }
                    })
            return jsonify({"status": "OK", "commits": data, "count": len(data)}), 200
        else:
            return jsonify({"error": "missing name"}), 404
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400

@app.route('/pr', methods=['POST'])
def pr():
    try:
        req_data = request.get_json()
        if 'branch' in req_data:
            data = []
            for pr in repo.get_pulls(
                    state='all', direction='asc', base=req_data['branch'], sort='created'):
                author = {"name": pr.user.name, "email": pr.user.email}
                data.append({
                    "title": pr.title, 
                    "description": pr.body,
                    "status": pr.state, 
                    "author": author, 
                    "number": pr.number, 
                    "id": pr.id,
                    "merge_commit_sha": pr.merge_commit_sha
                })
            return jsonify({"status": "OK", "prs": data, "count": len(data)}), 200
        else:
            return jsonify({"error": "Direction or Repo not found in body. Expecting JSON."}), 404
    except Exception as e:
        return jsonify({"error": f"{e}"}), 406

@app.route('/pr/get/<pr_number>', methods=['GET'])
def get_pr(pr_number):
    try:
        if pr_number:
            details = repo.get_pull(int(pr_number))
            assigness = [{"name": assignee.name, "email": assignee.email} for assignee in details.assignees]
            data = {
                "author": {"name": details.user.name, "email": details.user.email},
                "number": details.number,
                "id": details.id,
                "state": details.state,
                "title": details.title,
                "is_merged": details.merged,
                "merged_at": details.merged_at,
                "merged_by": {"name": details.merged_by.name, "email": details.merged_by.email},
                "closed_at": details.closed_at,
                "created_at": details.created_at,
                "html_url": details.html_url,
                "url": details.url,
                "assigness": assigness,
                "changed_files": details.changed_files,
                "additions": details.additions,
                "deletions": details.deletions,
                "head": {"ref": details.head.ref, "sha": details.head.sha},
                "base": {"ref": details.base.ref, "sha": details.base.sha},
                "merge_commit_sha": details.merge_commit_sha
            }
            return jsonify({"state": "OK", "pr": data}), 200
        else:
            return jsonify({"error": "PR Number was not found in query param"}), 404
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400


@app.route('/pr/create', methods=['POST'])
def create_pr():
    try:
        req_data = request.get_json()
        if 'title' in req_data and 'body' in req_data and 'base' in req_data and 'head' in req_data:
            pull_request = repo.create_pull(title=req_data['title'], body=req_data['body'], head=req_data['head'], base=req_data['base'])
            data = {
                "author": {"name": pull_request.user.name, "email": pull_request.user.email},
                "number": pull_request.number,
                "id": pull_request.id,
                "state": pull_request.state,
                "title": pull_request.title,
                "created_at": pull_request.created_at,
                "html_url": pull_request.html_url,
                "url": pull_request.url,
                "changed_files": pull_request.changed_files,
                "additions": pull_request.additions,
                "deletions": pull_request.deletions,
                "head": {"ref": pull_request.head.ref, "sha": pull_request.head.sha},
                "base": {"ref": pull_request.base.ref, "sha": pull_request.base.sha},
                "merge_commit_sha": pull_request.merge_commit_sha
            }
            return jsonify({"state": "OK", "pr": data}), 200
        else:
            return jsonify({"error": "Insufficent info found in body. Expecting JSON.", "body": req_data}), 404
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400

@app.route('/pr/make', methods=['POST'])
def make_pr():
    try:
        req_data = request.get_json()
        if 'message' in req_data and 'title' in req_data and 'id' in req_data:
            pull_request = repo.get_pull(int(req_data['id']))
            merge = pull_request.merge(commit_message=req_data['message'], commit_title=req_data['title'], merge_method='merge')
            return jsonify({"status": "OK", "pr": { "merged": merge.merged, "message": merge.message, "id": merge.sha}}), 200
        else:
            return jsonify({"error": "Direction or Repo not found in body. Expecting JSON."}), 404
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400

if __name__ == '__main__':
	app.run(port=port if port != None else 8000)
