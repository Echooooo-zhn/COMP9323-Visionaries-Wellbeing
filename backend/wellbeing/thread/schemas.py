from apiflask import Schema
from apiflask.fields import Integer, String, DateTime, Nested, List, Boolean

from wellbeing.user.schemas import UserSchema, CategorySchema

'''
Object Schema
'''


class ReplySchema(Schema):
    id = Integer(required=True, example=0)
    user = Nested(UserSchema, required=True)
    body = String(required=True, example='Cherry lips, crystal skies')
    created_at = DateTime(required=True, example='2020-01-01T00:00:00Z')


class ThreadSchema(Schema):
    id = Integer(required=True, example=0)
    title = String(required=True, example='Blank Space')
    body = String(required=True, example='Cherry lips, crystal skies')
    created_at = DateTime(required=True, example='2020-01-01T00:00:00Z')
    resolved = Boolean(required=True, example=False)

    user = Nested(UserSchema, required=True, partial=True)
    category = Nested(CategorySchema)
    replies = List(Nested(ReplySchema), required=True)


'''
API Schema
'''

'''
Thread Schema
'''


class GetThreadsOutSchema(Schema):
    threads = List(Nested(ThreadSchema), required=True)


class PostThreadInSchema(Schema):
    title = String(required=True, example='Blank Space')
    body = String(required=True, example='Cherry lips, crystal skies')
    category_id = Integer(required=True, example=1)


class PostThreadOutSchema(Schema):
    thread = Nested(ThreadSchema, required=True)


class PutThreadInSchema(Schema):
    thread_id = Integer(required=True, example=1)
    title = String(required=True, example='Blank Space')
    body = String(required=True, example='Cherry lips, crystal skies')
    category_id = Integer(required=True, example=1)
    resolved = Boolean(required=True, example=False)


'''
Reply Schema
'''


class PostReplyInSchema(Schema):
    thread_id = Integer(required=True, example=1)
    body = String(required=True, example='Cherry lips, crystal skies')


class PostReplyOutSchema(Schema):
    reply = Nested(ReplySchema, required=True)


class PutReplyInSchema(Schema):
    reply_id = Integer(required=True, example=1)
    body = String(required=True, example='Cherry lips, crystal skies')
