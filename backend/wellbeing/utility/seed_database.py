import json
from pathlib import Path

from wellbeing.extensions import db
from wellbeing.user.models import User
from wellbeing.QA.models import Category, QA, Tag, QATag
from wellbeing.user.models import User, Language, Qualification
from wellbeing.user.models import UserLanguage, UserCategory, UserQualification
from wellbeing.meeting.models import TimeRange

SEEDING_DATA_PATH = Path(__file__).absolute().parents[2] / "seeding_data.json"


def seed_database():
    with open(SEEDING_DATA_PATH, 'r') as f:
        data = json.load(f)

    try:
        # Single Table
        for user in data['user']:
            db.session.add(User(**user))

        for category in data['category']:
            db.session.add(Category(**category))

        for tag in data['tag']:
            db.session.add(Tag(**tag))

        for qa in data['qa']:
            db.session.add(QA(**qa))

        for language in data['language']:
            db.session.add(Language(**language))

        for qualification in data['qualification']:
            db.session.add(Qualification(**qualification))

        for timerange in data['timerange']:
            db.session.add(TimeRange(**timerange))

        db.session.commit()

        # Multi Table
        for qa_tag in data['qa_tag']:
            db.session.add(QATag(**qa_tag))

        for user_language in data['user_language']:
            db.session.add(UserLanguage(**user_language))

        for user_category in data['user_category']:
            db.session.add(UserCategory(**user_category))

        for user_qualification in data['user_qualification']:
            db.session.add(UserQualification(**user_qualification))

        db.session.commit()

    except Exception as e:
        db.session.rollback()
        raise e


if __name__ == '__main__':
    seed_database()
