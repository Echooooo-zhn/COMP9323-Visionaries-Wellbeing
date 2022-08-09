# -*- coding: utf-8 -*-
"""Click commands."""
import os

import click
from flask.cli import with_appcontext

from wellbeing.extensions import db

HERE = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.join(HERE, os.pardir)


@click.command()
@with_appcontext
def createdb():
    """Create the database and tables."""
    db.create_all()
    click.echo("Database created.")


@click.command()
@with_appcontext
def dropdb():
    """Drop the database."""
    db.reflect()
    db.drop_all()
    click.echo("Database dropped.")


@click.command()
@with_appcontext
def cleardb():
    """Clear the database."""
    meta = db.metadata
    for table in reversed(meta.sorted_tables):
        click.echo(f'Clear table {table}')
        session.execute(table.delete())
    session.commit()
    click.echo('Date cleared')


@click.command()
@with_appcontext
def seed():
    """Drop the database."""
    from wellbeing.utility.seed_database import seed_database
    try:
        seed_database()
        click.echo("Database seeded.")
    except Exception as e:
        click.echo(e)
