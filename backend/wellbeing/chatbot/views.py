from apiflask import APIBlueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, current_user

from wellbeing.chatbot.schemas import (
    ChatbotSchema
)

import wellbeing.chatbot.controllers as controllers

blueprint = APIBlueprint('chatbot', __name__)

@blueprint.route('/chatbot')
class ChatbotResponse(MethodView):
    @blueprint.input(ChatbotSchema)
    @blueprint.doc(
        security='JWT Bearer Token',
        summary='Chatbot Responses',
        description='Chatbot Responses',
        responses={
            200: 'User profile Updated',
            404: 'User Not Found',
        })
    @jwt_required()
    def post(self, data):
        return controllers.state_response(data)