from apiflask import Schema
from apiflask.fields import String, Integer, Email, List, Nested, DateTime
from apiflask.validators import OneOf

'''
Class Schema
'''


class QualificationSchema(Schema):
    id = Integer(required=True, example=1)
    acquired_at = DateTime(required=True, example='2020-01-01T00:00:00')
    description = String(required=True, example='I love my country')


class LanguageSchema(Schema):
    id = Integer(required=True, example=1)
    language_name = String(required=True, example='English')


class CategorySchema(Schema):
    id = Integer(required=True, example=0)
    category_name = String(required=True, example='Pop')
    category_image_src = String(required=True)
    category_description = String(required=True,
                                  example='Pop is a genre of music that emerged in the United States in the late '
                                          '1960s, and has since become a global phenomenon.')


class UserSchema(Schema):
    id = Integer(required=True, example=1)
    username = String(required=True, example='Taylor Swift')
    email = Email(required=True, example='ts@gmail.com')
    account_type = String(required=True, validate=OneOf(['student', 'expert', 'admin']), example='student')
    biography = String(example='Hello, I am Taylor Swift')
    profile_image_src = String()

    languages = List(Nested(LanguageSchema))
    qualifications = List(Nested(QualificationSchema))
    interested_categories = List(Nested(CategorySchema))


'''
User Schema
'''


class GetUserOutSchema(Schema):
    user = Nested(UserSchema, required=True, partial=True)


class PutUserInSchema(Schema):
    username = String(required=True, example='Taylor Swift')
    biography = String(example='Hello, I am Taylor Swift')
    profile_image_src = String()

    language_ids = List(Integer())
    interested_category_ids = List(Integer())


class UpdatePasswordInSchema(Schema):
    user_id = Integer(required=True, example=1)
    new_password = String(required=True, example='TaylorSwift')


'''
Langauge Schema
'''


class LanguageSchema(Schema):
    id = Integer(required=True, example=1)
    language_name = String(required=True, example='English')


class GetLanguagesOutSchema(Schema):
    languages = List(Nested(LanguageSchema))
