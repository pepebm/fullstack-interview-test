from .db import db

class Pr(db.Document):
    title = db.StringField(required=True)
    description = db.StringField(required=True)
    status = db.StringField(required=True)
    author = db.StringField(required=True)
    number = db.StringField(required=True, unique=True)
    id = db.StringField(required=True, unique=True)
    merge_commit_sha = db.StringField(required=True, unique=True)