import datetime

from flask_jwt_extended import current_user
from sqlalchemy.sql import or_

from wellbeing.QA.models import QA, Tag, Category
from wellbeing.extensions import db

'''
QA Controllers
'''


def post_qa(data):
    # Post a qa
    new_qa = QA(
        title=data['title'],
        body=data['body'],
        author_id=current_user.id,
        video_url=data.get('video_url', None),
    )
    new_qa.category = Category.query.filter_by(
        id=data['category_id']).first_or_404()
    new_qa.tags = Tag.query.filter(Tag.id.in_(data['tag_ids'])).all()

    db.session.add(new_qa)
    db.session.commit()
    return {'message': 'QA Posted'}


def get_qa_by_id(qa_id):
    return {'qa': QA.query.filter_by(id=qa_id).first_or_404().serialized}


def get_qas_by_time():
    three_months_ago = datetime.datetime.today() - datetime.timedelta(weeks=12)
    return {'qas': [qa.serialized for qa in QA.query.filter(QA.review_at > three_months_ago).all()]}


def get_qas_not_reviewed():
    three_months_ago = datetime.datetime.today() - datetime.timedelta(weeks=12)
    return {'qas': [qa.serialized for qa in QA.query.filter(QA.review_at < three_months_ago).all()]}


def delete_qa_by_id(qa_id):
    db.session.delete(QA.query.filter_by(
        id=qa_id).first_or_404(description='QA Not Found'))
    db.session.commit()
    return {'message': 'QA Deleted'}


def put_qa_by_id(qa_id, data):
    qa = QA.query.filter_by(id=qa_id).first_or_404()
    qa.title = data['title']
    qa.body = data['body']
    qa.category = Category.query.filter_by(
        id=data['category_id']).first_or_404()
    qa.video_url = data.get('video_url', None)
    qa.tags = Tag.query.filter(Tag.id.in_(data['tag_ids'])).all()
    db.session.commit()
    return {'message': 'QA Updated'}


def get_qas(data):
    conditions = []
    if 'category_ids' in data:
        conditions.append(QA.category_id.in_(data['category_ids']))
    if 'tag_ids' in data:
        conditions.append(QA.tags.any(Tag.id.in_(data['tag_ids'])))
    if 'keyword' in data:
        conditions.append(QA.title.like('%' + data['keyword'] + '%'))

    qas = QA.query.filter(or_(*conditions)).all()
    return {'qas': [qa.serialized for qa in qas]}


'''
Tag Controllers
'''


def get_tags():
    return {'tags': [tag.serialized for tag in Tag.query.all()]}


def post_tag(data):
    new_tag = Tag(
        tag_name=data['tag_name']
    )
    db.session.add(new_tag)
    db.session.commit()
    return {'message': 'Tag Created'}


def delete_tag_by_id(tag_id):
    db.session.delete(Tag.query.filter_by(
        id=tag_id).first_or_404(description='Tag Not Found'))
    db.session.commit()
    return {'message': 'Tag Deleted'}


def put_tag_by_id(tag_id, data):
    tag = Tag.query.filter_by(id=tag_id).first_or_404(
        description='Tag Not Found')
    tag.tag_name = data['tag_name']
    db.session.commit()
    return {'message': 'Tag Updated'}


'''
Category Controllers
'''


def get_categories():
    return {'categories': [category.serialized for category in Category.query.all()]}


def post_category(data):
    new_category = Category(
        category_name=data['category_name'],
        category_image_src=data['category_image_src'],
        category_description=data['category_description']
    )
    db.session.add(new_category)
    db.session.commit()
    return {'message': 'Category Created'}


def delete_category_by_id(category_id):
    db.session.delete(Category.query.filter_by(
        id=category_id).first_or_404(description='Category Not Found'))
    db.session.commit()
    return {'message': 'Category Deleted'}


def put_category_by_id(category_id, data):
    category = Category.query.filter_by(id=category_id).first_or_404(
        description='Category Not Found')

    category.category_name = data['category_name']
    category.category_image_src = data['category_image_src']
    category.category_description = data['category_description']

    db.session.commit()
    return {'message': 'Category Updated'}
