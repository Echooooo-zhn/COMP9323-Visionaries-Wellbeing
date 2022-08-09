# -*- coding: utf-8 -*-
"""Extensions module. Each extension is initialized in the wellbeing factory located in wellbeing.py."""
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy

jwt = JWTManager()
db = SQLAlchemy()
