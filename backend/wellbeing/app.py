# -*- coding: utf-8 -*-
"""The wellbeing module, containing the app factory function."""

from apiflask import APIFlask  # step one
from flask_cors import *

from wellbeing import commands, auth, user, QA, chatbot, thread, meeting
from wellbeing.extensions import (
    jwt,
    db,
)


def create_app(config_object="wellbeing.settings"):
    """Create application factory, as explained here: http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = APIFlask(__name__.split(".")[0], docs_path='/')
    app.config.from_object(config_object)
    CORS(app, supports_credentials=True)
    register_extensions(app)
    register_blueprints(app)
    register_commands(app)
    configure_security_schemes(app)
    return app


def register_extensions(app):
    """Register Flask extensions."""
    jwt.init_app(app)
    db.init_app(app)


def register_blueprints(app):
    """Register Flask blueprints."""
    app.register_blueprint(auth.views.blueprint)
    app.register_blueprint(user.views.blueprint)
    app.register_blueprint(QA.views.qa_blueprint)
    app.register_blueprint(QA.views.tag_blueprint)
    app.register_blueprint(QA.views.category_blueprint)
    app.register_blueprint(thread.views.thread_blueprint)
    app.register_blueprint(meeting.views.expert_availability_blueprint)
    app.register_blueprint(meeting.views.student_availability_blueprint)
    app.register_blueprint(meeting.views.meeting_blueprint)
    app.register_blueprint(chatbot.views.blueprint)


def register_commands(app):
    """Register Click commands."""
    app.cli.add_command(commands.createdb)
    app.cli.add_command(commands.dropdb)
    app.cli.add_command(commands.seed)


def configure_security_schemes(app):
    app.security_schemes = {  # equals to use config SECURITY_SCHEMES
        'JWT Bearer Token': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
        },
    }
