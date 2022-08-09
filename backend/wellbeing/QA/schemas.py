from apiflask import Schema
from apiflask.fields import Integer, String, DateTime, Nested, List

from wellbeing.user.schemas import UserSchema, CategorySchema

'''
Object Schema
'''


class TagSchema(Schema):
    id = Integer(required=True, example=0)
    tag_name = String(required=True, example='Pop')


class QASchema(Schema):
    id = Integer(required=True, example=0)
    title = String(required=True, example='Blank Space')
    body = String(required=True, example='Cherry lips, crystal skies')
    created_at = DateTime(required=True, example='2020-01-01T00:00:00Z')
    reviewed_at = DateTime(required=True, example='2020-01-01T00:00:00Z')
    video_url = String(example='https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    author = Nested(UserSchema, required=True, partial=True)
    category = Nested(CategorySchema, required=True)
    tags = List(Nested(TagSchema, required=True), required=True)


'''
API Schema
'''

'''
Category APIs
'''


class GetCategoriesOutSchema(Schema):
    categories = List(Nested(CategorySchema), required=True)


class PostCategoryInSchema(Schema):
    category_name = String(required=True, example='Pop')
    category_image_url = String(required=True)
    category_description = String(required=True,
                                  example='Pop is a genre of music that emerged in the United States in the late '
                                          '1960s, and has since become a global phenomenon.')


class PutCategoryInSchema(Schema):
    category = Nested(CategorySchema, required=True)


'''
Tag APIs
'''


class GetTagsOutSchema(Schema):
    tags = List(Nested(TagSchema), required=True)


class PostTagInSchema(Schema):
    tag_name = String(required=True, example='Country')


class PutTagInSchema(Schema):
    tag_name = String(required=True, example='Country')


'''
QA APIs
'''


class GetQAsInSchema(Schema):
    category_ids = List(Integer(), example=[0, 1])
    tag_ids = List(Integer(), example=[2, 3])
    keyword = String(example='Love Story')


class GetQAsOutSchema(Schema):
    qas = List(Nested(QASchema), required=True)


class GetQAOutSchema(Schema):
    qa = Nested(QASchema, required=True)


class PostQAInSchema(Schema):
    category_id = Integer(required=True, example=0)
    tag_ids = List(Integer, example=[2, 3])
    title = String(required=True, example='Blank Space')
    body = String(required=True, example='Cherry lips, crystal skies')
    video_url = String(example='https://www.youtube.com/watch?v=dQw4w9WgXcQ')


class PutQAInSchema(Schema):
    title = String(required=True, example='Blank Space')
    body = String(required=True, example='Cherry lips, crystal skies')
    category_id = Integer(required=True, example=0)
    tag_ids = List(Integer, example=[2, 3])
    video_url = String(example='https://www.youtube.com/watch?v=dQw4w9WgXcQ')
