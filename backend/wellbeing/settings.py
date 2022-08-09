# -*- coding: utf-8 -*-
"""Application configuration.

Most configuration is set via environment variables.

For local development, use a .env file to set
environment variables.
"""
import os
from datetime import timedelta

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

ENV = os.environ["FLASK_ENV"]
DEBUG = ENV == "development"
SQLALCHEMY_DATABASE_URI = os.environ["DATABASE_URL"]
DEBUG_TB_ENABLED = DEBUG
DEBUG_TB_INTERCEPT_REDIRECTS = False
CACHE_TYPE = "simple"  # Can be "memcached", "redis", etc.
SQLALCHEMY_TRACK_MODIFICATIONS = False
JWT_SECRET_KEY = os.environ['JWT_SECRET_KEY']
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
