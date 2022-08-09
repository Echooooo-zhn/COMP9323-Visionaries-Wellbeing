from apiflask import APIBlueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required, current_user

import wellbeing.user.controllers as controllers
from wellbeing.user.schemas import (
    GetUserOutSchema,
    PutUserInSchema,
    GetLanguagesOutSchema,
    UpdatePasswordInSchema,
)

blueprint = APIBlueprint('user', __name__)


@blueprint.route('/user_profile/<int:user_id>')
class UserProfileByID(MethodView):
    @blueprint.output(GetUserOutSchema, 200)
    @blueprint.doc(
        summary='Get User profile by ID',
        description='Get User profile by ID',
        responses={
            404: 'User Not Found',
        }
    )
    def get(self, user_id):
        return controllers.get_profile_by_id(user_id)


@blueprint.route('/user_profile')
class UserProfile(MethodView):
    @blueprint.output(GetUserOutSchema, 200)
    @blueprint.doc(
        security='JWT Bearer Token',
        summary='Get current user profile',
        description='Get current user profile',
        responses={
            404: 'User Not Found',
        }
    )
    @jwt_required()
    def get(self):
        return controllers.get_profile_by_id(current_user.id)

    @blueprint.input(PutUserInSchema)
    @blueprint.output(GetUserOutSchema, 200)
    @blueprint.doc(
        security='JWT Bearer Token',
        summary='Update User profile',
        description='Update User profile',
        responses={
            200: 'User profile Updated',
            404: 'User Not Found',
        })
    @jwt_required()
    def put(self, data):
        return controllers.put_current_user_profile(data)


@blueprint.put('/update_password')
@blueprint.input(UpdatePasswordInSchema)
@blueprint.doc(
    summary='Update User password',
    description='Update User password',
    responses={
        200: 'User password Updated',
        404: 'User Not Found',
    })
def update_password(data):
    return controllers.update_user_password(data['user_id'], data['new_password'])


@blueprint.route('/languages')
class Languages(MethodView):
    @blueprint.output(GetLanguagesOutSchema, 200)
    @blueprint.doc(
        summary='Get Languages',
        description='Get Languages',
    )
    def get(self):
        return controllers.get_all_languages()
