from apiflask import APIBlueprint
from flask.views import MethodView
from flask_jwt_extended import jwt_required

import wellbeing.QA.controllers as controllers
from wellbeing.QA.schemas import (
    GetTagsOutSchema,
    GetCategoriesOutSchema,
    GetQAsInSchema,
    GetQAsOutSchema,
    GetQAOutSchema,
    PostQAInSchema,
    PutQAInSchema,
    PostTagInSchema,
    PutTagInSchema,
    PutCategoryInSchema,
)

qa_blueprint = APIBlueprint('QA', __name__)


@qa_blueprint.route('/qa')
class QA(MethodView):
    @qa_blueprint.input(PostQAInSchema)
    @qa_blueprint.doc(
        security='JWT Bearer Token',
        summary='Post a new QA',
        description='Post a new QA',
        responses={
            200: 'QA Posted',
        }
    )
    @jwt_required()
    def post(self, data):
        return controllers.post_qa(data)


@qa_blueprint.route('/qa/<int:qa_id>')
class QAByID(MethodView):

    @qa_blueprint.output(GetQAOutSchema, 200)
    @qa_blueprint.doc(
        summary='Get QA by ID',
        description='Get QA by ID',
        responses={
            404: 'QA Not Found',
        }
    )
    def get(self, qa_id):
        return controllers.get_qa_by_id(qa_id)

    @qa_blueprint.doc(
        security='JWT Bearer Token',
        summary='Delete QA',
        description='Delete QA',
        responses={
            200: 'QA Deleted',
            404: 'QA Not Found',
        }
    )
    @jwt_required()
    def delete(self, qa_id):
        return controllers.delete_qa_by_id(qa_id)

    @qa_blueprint.input(PutQAInSchema)
    @qa_blueprint.doc(
        security='JWT Bearer Token',
        summary='Update QA',
        description='Update QA',
        responses={
            200: 'QA Updated',
            404: 'QA Not Found',
        }
    )
    @jwt_required()
    def put(self, qa_id, data):
        return controllers.put_qa_by_id(qa_id, data)


@qa_blueprint.route('/qas')
class QAs(MethodView):
    @qa_blueprint.input(GetQAsInSchema, location='query')
    @qa_blueprint.output(GetQAsOutSchema, 200)
    @qa_blueprint.doc(
        summary='Get list of QA by filters',
        description='Get QAs by category or tags or keyword',
        responses={
            404: 'Not Found',
        }
    )
    def get(self, data):
        return controllers.get_qas(data)


@qa_blueprint.route('/qa_reviewed')
class QAByTime(MethodView):
    @qa_blueprint.output(GetQAsOutSchema, 200)
    @qa_blueprint.doc(
        summary='Get list of QA reviewed in three month',
        description='Get QAs by time',
        responses={
            404: 'Not Found',
        }
    )
    def get(self):
        return controllers.get_qas_by_time()


@qa_blueprint.route('/qa_not_reviewed')
class QANotReviewed(MethodView):
    @qa_blueprint.output(GetQAsOutSchema, 200)
    @qa_blueprint.doc(
        summary='Get list of QA have not been reviewed in three month',
        description='Get QAs by time',
        responses={
            404: 'Not Found',
        }
    )
    def get(self):
        return controllers.get_qas_not_reviewed()


'''
Tag APIs
'''

tag_blueprint = APIBlueprint('tag', __name__)


@tag_blueprint.route('/tags')
class Tags(MethodView):
    @tag_blueprint.output(GetTagsOutSchema, 200)
    @tag_blueprint.doc(
        summary='Get all tags',
        description='Get all tags',
    )
    def get(self):
        return controllers.get_tags()


@tag_blueprint.route('/tag')
class Tag(MethodView):
    @tag_blueprint.input(PostTagInSchema)
    @tag_blueprint.doc(
        security='JWT Bearer Token',
        summary='Create new tag',
        description='Create new tag',
        responses={
            200: 'Tag Created',
        }
    )
    @jwt_required()
    def post(self, data):
        return controllers.post_tag(data)


@tag_blueprint.route('/tag/<int:tag_id>')
class TagById(MethodView):
    @tag_blueprint.doc(
        security='JWT Bearer Token',
        summary='Delete tag',
        description='Delete tag',
        responses={
            200: 'Tag Deleted',
            404: 'Tag Not Found',
        },
        hide=True,
    )
    @jwt_required()
    def delete(self, tag_id):
        return controllers.delete_qa_by_id(tag_id)

    @tag_blueprint.input(PutTagInSchema)
    @tag_blueprint.doc(
        security='JWT Bearer Token',
        summary='Update tag',
        description='Update tag',
        responses={
            200: 'Tag Updated',
            404: 'Tag Not Found',
        }
    )
    @jwt_required()
    def put(self, tag_id):
        return controllers.put_qa_by_id(tag_id, data)


'''
Category APIs
'''

category_blueprint = APIBlueprint('category', __name__)


@category_blueprint.route('/categories')
class Categories(MethodView):
    @category_blueprint.output(GetCategoriesOutSchema, 200)
    @category_blueprint.doc(
        summary='Get all categories',
        description='Get all categories',
    )
    def get(self):
        return controllers.get_categories()


@category_blueprint.route('/category')
class Category(MethodView):
    @category_blueprint.input(PostTagInSchema)
    @category_blueprint.doc(
        security='JWT Bearer Token',
        summary='Create new category',
        description='Create new category',
        responses={
            200: 'Category Created',
        })
    def post(self, data):
        return controllers.post_category(data)


@category_blueprint.route('/category/<int:category_id>')
class CategoryById(MethodView):
    @category_blueprint.doc(
        security='JWT Bearer Token',
        summary='Delete category',
        description='Delete category',
        responses={
            200: 'Category Deleted',
            404: 'Category Not Found',
        },
        hide=True,
    )
    @jwt_required()
    def delete(self, category_id):
        return controllers.delete_category_by_id(category_id)

    @category_blueprint.input(PutCategoryInSchema)
    @category_blueprint.doc(
        security='JWT Bearer Token',
        summary='Update category',
        description='Update category',
        responses={
            200: 'Category Updated',
            404: 'Category Not Found',
        }
    )
    @jwt_required()
    def put(self, category_id, data):
        return controllers.put_category_by_id(category_id, data)
