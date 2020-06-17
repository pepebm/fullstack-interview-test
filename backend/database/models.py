from .db import db

class Pr(db.Document):
    title = db.StringField(required=True)
    description = db.StringField(required=True)
    status = db.StringField(required=True)
    number = db.IntField(required=True, unique=True)
    pr_id = db.IntField(required=True, unique=True)
