from datetime import datetime

from wellbeing.extensions import db


class Thread(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    resolved = db.Column(db.Boolean, default=False, nullable=False, index=True)

    # Relationships
    category = db.relationship('Category', lazy=False, uselist=False, back_populates='threads')
    replies = db.relationship('Reply', lazy=False, uselist=True, back_populates='thread')
    user = db.relationship('User', lazy=False, uselist=False, back_populates='threads')

    @property
    def serialized(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'resolved': self.resolved,
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'email': self.user.email,
                'account_type': self.user.account_type,
                'profile_image_src': self.user.profile_image_src,
            },
            'category': {
                'id': self.category.id,
                'category_name': self.category.category_name,
            },
            'replies': [reply.serialized for reply in self.replies],
        }


class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    thread_id = db.Column(db.Integer, db.ForeignKey('thread.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    thread = db.relationship('Thread', lazy=True, uselist=False, back_populates='replies')
    user = db.relationship('User', lazy=False, uselist=False, back_populates='replies')

    @property
    def serialized(self):
        return {
            'id': self.id,
            'body': self.body,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'user': {
                'id': self.user.id,
                'username': self.user.username,
                'email': self.user.email,
                'account_type': self.user.account_type,
                'profile_image_src': self.user.profile_image_src,
            },
        }
