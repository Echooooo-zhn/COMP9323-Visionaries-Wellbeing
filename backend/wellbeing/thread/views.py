from apiflask import APIBlueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required

import wellbeing.thread.controllers as controllers
from wellbeing.thread.schemas import (
    PostThreadInSchema,
    PostThreadOutSchema,
    GetThreadsOutSchema,
    PutThreadInSchema,
    PostReplyInSchema,
    PostReplyOutSchema,
    PutReplyInSchema,
)

thread_blueprint = APIBlueprint('thread', __name__)

'''
Thread Endpoints
'''


@thread_blueprint.route('/threads_by_user/<int:user_id>')
class ThreadsByUser(MethodView):
    @thread_blueprint.output(GetThreadsOutSchema, 200)
    @thread_blueprint.doc(
        summary='Get all the unresolved threads the current user has replied to',
        responses={200: 'OK', 404: 'User Not Found'},
    )
    def get(self, user_id):
        return controllers.get_threads_by_user(user_id)


@thread_blueprint.route('/unanswered_unresolved_threads')
class UnreadThreads(MethodView):
    @thread_blueprint.output(GetThreadsOutSchema, 200)
    @thread_blueprint.doc(
        security='JWT Bearer Token',
        summary='Get all unanswered & unresolved threads the current user is interested in',
        description='Threads returned are ordered by update_at desc',
        responses={200: 'OK', 404: 'User Not Found'},
    )
    @jwt_required()
    def get(self):
        return controllers.unanswered_unresolved_threads()


@thread_blueprint.route('/threads')
class Threads(MethodView):
    @thread_blueprint.output(GetThreadsOutSchema, 200)
    @thread_blueprint.doc(
        summary='Get all unresolved threads',
        description='Get all unresolved threads',
    )
    def get(self):
        return controllers.get_threads()


@thread_blueprint.route('/thread')
class Thread(MethodView):
    @thread_blueprint.input(PostThreadInSchema)
    @thread_blueprint.output(PostThreadOutSchema, 200)
    @thread_blueprint.doc(
        security='JWT Bearer Token',
        summary='Post a new thread',
        description='Post a new thread',
        responses={
            200: 'Thread Posted',
        }
    )
    @jwt_required()
    def post(self, data):
        return controllers.post_thread(data)

    @thread_blueprint.input(PutThreadInSchema)
    @thread_blueprint.output(PostThreadOutSchema, 200)
    @thread_blueprint.doc(
        security='JWT Bearer Token',
        summary='Update thread',
        description='Update thread',
        responses={
            404: 'Thread not found'
        }
    )
    @jwt_required()
    def put(self, data):
        return controllers.put_thread(data)


@thread_blueprint.route('/set_thread_resolved/<int:thread_id>')
class ResolveThread(MethodView):
    @thread_blueprint.output(PostThreadOutSchema, 200)
    @thread_blueprint.doc(
        security='JWT Bearer Token',
        summary='Set thread as resolved or unresolved',
        description='If the thread is resolved, it will be marked as resolved. If the thread is unresolved, '
                    'it will be marked as unresolved',
        responses={
            404: 'Thread not found'
        }
    )
    @jwt_required()
    def put(self, thread_id):
        return controllers.resolve_thread(thread_id)


'''
Reply Endpoints
'''


@thread_blueprint.route('/reply')
class Reply(MethodView):
    @thread_blueprint.input(PostReplyInSchema)
    @thread_blueprint.output(PostReplyOutSchema, 200)
    @thread_blueprint.doc(
        security='JWT Bearer Token',
        summary='Post a new reply',
        description='Post a new reply',
        responses={
            200: 'Reply Posted',
            404: 'Thread not found'
        })
    @jwt_required()
    def post(self, data):
        return controllers.post_reply(data)

    @thread_blueprint.input(PutReplyInSchema)
    @thread_blueprint.output(PostReplyOutSchema, 200)
    @thread_blueprint.doc(
        security='JWT Bearer Token',
        summary='Update reply',
        description='Update reply',
        responses={
            404: 'Reply not found'
        }
    )
    @jwt_required()
    def put(self, data):
        return controllers.put_reply(data)
