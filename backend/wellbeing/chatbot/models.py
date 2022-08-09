from wellbeing.extensions import db
from datetime import datetime

class UserQuestion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    status = db.Column(db.Text, nullable=True)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationships
    user = db.relationship('User', lazy=False, uselist=False, back_populates='user_questions')
