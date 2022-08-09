from flask_jwt_extended import current_user
from sqlalchemy.sql import and_, not_

from wellbeing.QA.models import Category
from wellbeing.extensions import db
from wellbeing.thread.models import Thread, Reply


def get_threads():
    # Return all unresolved threads
    return {'threads': [thread.serialized for thread in Thread.query.filter(Thread.resolved == False).all()]}


def get_threads_by_user(user_id):
    # Return all unresolved threads replied by the user
    return {'threads': [thread.serialized for thread in
                        Thread.query
                        .filter(and_(Thread.replies.any(Reply.user_id == user_id), Thread.resolved == False))
                        .order_by(Thread.updated_at.desc())
                        .all()]}


def unanswered_unresolved_threads():
    # Return all threads without replies that belongs to any of the users' interested categories
    category_ids = [category.id for category in current_user.interested_categories]
    return {'threads': [thread.serialized for thread in
                        Thread.query
                        .filter(and_(
                            not_(Thread.replies.any(Reply.user_id == current_user.id)),
                            Thread.resolved == False,
                            Thread.category_id.in_(category_ids)))
                        .order_by(Thread.updated_at.desc())
                        .all()]}


def post_thread(data):
    # Create a new thread
    new_thread = Thread(
        title=data['title'],
        body=data['body'],
        user_id=current_user.id,
    )
    new_thread.category = Category.query.filter_by(id=data['category_id']).first_or_404('Category Not Found')
    db.session.add(new_thread)
    db.session.commit()
    return {'thread': new_thread.serialized}


def put_thread(data):
    # Update a thread
    thread = Thread.query.filter_by(id=data['thread_id']).first_or_404('Thread Not Found')
    thread.title = data['title']
    thread.body = data['body']
    thread.category = Category.query.filter_by(id=data['category_id']).first_or_404('Category Not Found')
    thread.resolved = data['resolved']
    db.session.commit()
    return {'thread': thread.serialized}


def resolve_thread(thread_id):
    # Resolve a thread
    thread = Thread.query.filter_by(id=thread_id).first_or_404('Thread Not Found')
    thread.resolved = not thread.resolved
    db.session.commit()
    return {'thread': thread.serialized}


'''
Reply Controllers
'''


def post_reply(data):
    # Create a new reply
    new_reply = Reply(
        body=data['body'],
        user_id=current_user.id,
        thread_id=Thread.query.filter_by(id=data['thread_id']).first_or_404('Thread Not Found').id
    )
    db.session.add(new_reply)
    db.session.commit()
    return {'reply': new_reply.serialized}


def put_reply(data):
    # Update a reply
    reply = Reply.query.filter_by(id=data['reply_id']).first_or_404('Reply Not Found')
    reply.body = data['body']
    db.session.commit()
    return {'reply': reply.serialized}
