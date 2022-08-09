from datetime import datetime, timedelta, date as datetime_date

from apiflask import abort
from sqlalchemy.sql import and_

from wellbeing.QA.models import Category
from wellbeing.extensions import db
from wellbeing.meeting.models import TimeRange, Availability
from wellbeing.user.models import User
from wellbeing.utility.google_meeting import create_meeting

'''
Expert Availability
'''


def get_expert_availabilities_by_date(expert_id, date):
    # Get the availabilities of the expert on the given date
    time_ranges = TimeRange.query.all()
    result = [{
        'date': date,
        'time_range': time_range,
        'status': 'unavailable',
        'expert_id': expert_id,
    } for time_range in time_ranges]

    availabilities = Availability.query.filter_by(expert_id=expert_id, date=date).order_by(
        Availability.time_range_id).all()
    for availability in availabilities:
        result[availability.time_range_id - 1] = availability.serialized

    return result


def get_expert_availabilities_by_week(expert_id, date):
    # Get a weeks upcoming booked availabilities of the expert
    start_of_the_week = date - timedelta(days=date.weekday())
    end_of_the_week = date - timedelta(days=date.weekday()) + timedelta(days=4)

    start_date = max(start_of_the_week, datetime_date.today())

    result = []
    while start_date <= end_of_the_week:
        result.append(get_expert_availabilities_by_date(expert_id, start_date))
        start_date += timedelta(days=1)
    return result


def get_experts_availabilities_by_week_and_categories(date, category_ids):
    """
    Get the availabilities of experts who are interested in the given categories on the given date. Group by expert.
    """

    # Get the experts who are interested in the given categories
    experts = User.query.filter(User.interested_categories.any(Category.id.in_(category_ids))).all()

    # Get the availabilities of the experts on the given date
    result = []
    for expert in experts:
        result.append({
            'expert': expert.serialized,
            'availabilities': get_expert_availabilities_by_week(expert.id, date),
        })

    return result


def get_expert_availabilities(expert_id):
    # Get the availabilities of the expert
    availabilities = Availability.query.filter_by(expert_id=expert_id).order_by(
        Availability.date, Availability.time_range_id).all()
    return {"availabilities": [availability.serialized for availability in availabilities]}


def update_expert_availability(data):
    # Update the availability of a user.
    return {
        "availability": update_expert_availabilities(data['expert_id'], [data]).get('availabilities')[0]
    }


def get_expert_upcoming_booked_availabilities(expert_id):
    # Get the upcoming booked availabilities of the expert
    availabilities = Availability.query \
        .filter(and_(Availability.expert_id == expert_id,
                     Availability.date >= datetime_date.today(),
                     Availability.status == 'booked')) \
        .order_by(Availability.date, Availability.time_range_id).all()
    result = [{**availability.serialized, 'student': availability.student.serialized}
              for availability in availabilities]

    return result


def update_expert_availabilities(expert_id, availabilities):
    """
    Sets the availability for a user. availabilities is a list of dictionaries
    with the keys 'date', 'time_range_id', 'status' and optional keys 'student_id' and 'meeting_metadata'.
    Upsert if primary key exists.
    """
    for availability in availabilities:
        availability_db = Availability.query.filter_by(expert_id=expert_id, date=availability['date'],
                                                       time_range_id=availability['time_range_id']).first()
        if availability_db is None:
            availability_db = Availability(**availability)
            db.session.add(availability_db)
        else:
            availability_db.status = availability['status']
            availability_db.student_id = availability.get('student_id', None)
            availability_db.meeting_metadata = availability.get('meeting_metadata', None)

    db.session.commit()
    return {}


'''
Student Availability
'''


def get_student_upcoming_availabilities(student_id):
    # Get the upcoming availabilities of the student
    availabilities = Availability.query \
        .filter(and_(Availability.student_id == student_id,
                     Availability.date >= datetime_date.today(),
                     Availability.status == 'booked')) \
        .order_by(Availability.date, Availability.time_range_id).all()
    result = [{**availability.serialized, 'expert': availability.expert.serialized}
              for availability in availabilities]

    return {"availabilities": result}


def update_student_availability(data):
    # Update the availability of a user.
    return update_student_availabilities(data['student_id'], [data])


def update_student_availabilities(student_id, availabilities):
    # Update the availabilities of the student
    for availability in availabilities:
        availability_db = Availability.query.filter_by(student_id=student_id, date=availability['date'],
                                                       time_range_id=availability['time_range_id']).first()
        if availability_db is None:
            availability_db = Availability(**availability)
            db.session.add(availability_db)
        else:
            availability_db.status = availability['status']
            availability_db.expert_id = availability.get('expert_id', None)
            availability_db.meeting_metadata = availability.get('meeting_metadata', None)

    db.session.commit()
    return get_student_upcoming_availabilities(student_id)


'''
Booking
'''


def make_booking(expert_id, student_id, date, time_range_id):
    """
    Makes a booking with expert and student's email. Sets the status of the availability to 'booked'.
    """

    # Create availability if it doesn't exist
    try:
        availability_db = Availability.query.filter_by(expert_id=expert_id, date=date,
                                                       time_range_id=time_range_id).first()
        if not availability_db:
            availability = Availability(expert_id=expert_id, student_id=student_id, date=date,
                                        time_range_id=time_range_id, status='available')
        else:
            availability = availability_db

        # Check if the availability is available
        if availability.status != 'available':
            abort(409, f'The expert is {availability.status}')

        # Make the booking
        availability.status = 'booked'
        availability.student_id = student_id

        student = User.query.filter_by(id=student_id).first_or_404('Student not found')
        expert = User.query.filter_by(id=expert_id).first_or_404('Expert not found')

        time_range: TimeRange = TimeRange.query.filter_by(id=time_range_id).first_or_404('Time range not found')
        availability.meeting_metadata = create_meeting(expert.email, student.email,
                                                       datetime.combine(date, time_range.start_at),
                                                       datetime.combine(date, time_range.end_at))
        if not availability_db:
            db.session.add(availability)
        db.session.commit()

        return {'meeting': availability.serialized}

    except Exception as e:
        print(e)
        db.session.rollback()
        raise e
