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


@app.route('/pr', methods=['POST'])
def pr():
    try:
        req_data = request.get_json()
        if 'direction' in req_data and 'branch' in req_data:
            data = []
            for pr in repo.get_pulls(
                    state='all', direction=req_data['direction'], base=req_data['branch'], sort='created'):
                author = {"name": pr.user.name, "email": pr.user.email}
                data.append({"title": pr.title, "description": pr.body,
                             "status": pr.state, "author": author, "id": pr.number})
            return jsonify({"status": "OK", "prs": data, "count": len(data)}), 200
        else:
            return jsonify({"error": "Direction or Repo not found in body. Expecting JSON."}), 404
    except Exception as e:
        return jsonify({"error": f"{e}"}), 400

@app.route('/get_pr/<pr_number>', methods=['GET'])
def get_pr(pr_number):
    if pr_number:
        details = repo.get_pull(int(pr_number))
        assigness = [{"name": assignee.name, "email": assignee.email} for assignee in details.assignees]
        data = {
            "author": {"name": details.user.name, "email": details.user.email},
            "id": details.number,
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
            "deletions": details.deletions
        }
        return jsonify({"state": "OK", "pr": data}), 200
    else:
        return jsonify({"error": "PR Number was not found in query param"}), 404


if __name__ == '__main__':
	app.run(port=port if port != None else 8000)
