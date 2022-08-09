from flask_jwt_extended import current_user

from wellbeing.QA.models import Category
from wellbeing.extensions import db
from wellbeing.user.models import User, Language

'''
User Controllers
'''


def get_all_languages():
    return {'languages': Language.query.all()}


def get_profile_by_id(user_id):
    return {'user': User.query.filter_by(id=user_id).first_or_404().serialized}


def put_current_user_profile(data):
    user = User.query.filter_by(id=current_user.id).first_or_404()
    user.username = data['username']
    user.biography = data['biography']
    user.profile_image_src = data['profile_image_src']
    user.languages = Language.query.filter(Language.id.in_(data['language_ids'])).all()
    user.interested_categories = Category.query.filter(Category.id.in_(data['interested_category_ids'])).all()
    db.session.commit()
    return {'user': user.serialized}


def update_user_password(user_id, new_password):
    user = User.query.filter_by(id=user_id).first_or_404()
    user.set_password(new_password)
    db.session.commit()
    return {}
