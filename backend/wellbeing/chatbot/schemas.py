from apiflask import Schema
from apiflask.fields import String, Integer, Email, List, Nested, DateTime
from apiflask.validators import OneOf


class ChatbotSchema(Schema):
    state = Integer(required=True, example=1)
    input_text = String(required=True, example='Where can I get covid vaccine?')