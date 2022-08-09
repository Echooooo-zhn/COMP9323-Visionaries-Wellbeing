from apiflask import Schema
from apiflask.fields import Integer, String, DateTime, Nested, List, Date

from wellbeing.user.schemas import UserSchema


class TimeRangeSchema(Schema):
    id = Integer(required=True, example='1')
    start_at = DateTime(required=True)
    end_at = DateTime(required=True)


class AvailabilitySchema(Schema):
    expert_id = Integer(example=2)
    student_id = Integer(example=3)
    time_range = Nested(TimeRangeSchema)
    status = String(example='booked')
    date = Date(example="2022-08-06")
    meeting_metadata = String(
        example="https://www.google.com/calendar/event?eid=aDZhbHZwYXRoZm1rbjljY3NzdHFwMmY0NWsgbHBsc3oyMDAwQG0")


'''
Availability Schema
'''


class GetExpertAvailabilityByDateInSchema(Schema):
    date = Date(required=True, example="2022-08-06")
    expert_id = Integer(required=True)


class GetExpertAvailabilityByDateAndCategoryInSchema(Schema):
    date = Date(required=True, example="2022-08-06")
    category_ids = List(Integer(), required=True, example=[1, 2, 3])


class ExpertAvailabilityByDateAndCategorySchema(Schema):
    expert = Nested(UserSchema, partial=True)
    availabilities = List(List(Nested(AvailabilitySchema)))


class GetExpertAvailabilityByDateAndCategoryOutSchema(Schema):
    result = List(Nested(ExpertAvailabilityByDateAndCategorySchema))


class PostAvailabilityInSchema(Schema):
    expert_id = Integer()
    date = Date(example="2022-08-06")
    time_range_id = Integer()
    status = String(example='booked')
    meeting_metadata = String()
    student_id = Integer()


class PostAvailabilityOutSchema(Schema):
    availability = Nested(PostAvailabilityInSchema)


class PostExpertAvailabilitiesInSchema(Schema):
    expert_id = Integer(required=True)
    availabilities = List(Nested(PostAvailabilityInSchema))


class PostStudentAvailabilitiesInSchema(Schema):
    student_id = Integer(required=True)
    availabilities = List(Nested(PostAvailabilityInSchema))


class GetAvailabilitiesByDateOutSchema(Schema):
    availabilities = List(Nested(AvailabilitySchema))


class GetAvailabilitiesOutSchema(Schema):
    availabilities = List(List(Nested(AvailabilitySchema)))


class GetStudentAvailabilitiesSchema(Schema):
    expert = Nested(UserSchema, partial=True)
    expert_id = Integer(example=2)
    student_id = Integer(example=3)
    time_range = Nested(TimeRangeSchema)
    status = String(example='booked')
    date = Date(example="2022-08-06")
    meeting_metadata = String(
        example="https://www.google.com/calendar/event?eid=aDZhbHZwYXRoZm1rbjljY3NzdHFwMmY0NWsgbHBsc3oyMDAwQG0")


class GetStudentAvailabilitiesOutSchema(Schema):
    availabilities = List(Nested(GetStudentAvailabilitiesSchema))


class GetExpertUpcomingBookedAvailabilitiesSchema(Schema):
    student = Nested(UserSchema, partial=True)
    expert_id = Integer(example=2)
    student_id = Integer(example=3)
    time_range = Nested(TimeRangeSchema)
    status = String(example='booked')
    date = Date(example="2022-08-06")
    meeting_metadata = String(
        example="https://www.google.com/calendar/event?eid=aDZhbHZwYXRoZm1rbjljY3NzdHFwMmY0NWsgbHBsc3oyMDAwQG0")


class GetExpertUpcomingBookedAvailabilitiesOutSchema(Schema):
    booked_availabilities = List(Nested(GetExpertUpcomingBookedAvailabilitiesSchema))


'''
Meeting Schema
'''


class BookingMeetingInSchema(Schema):
    expert_id = Integer(required=True)
    student_id = Integer(required=True)
    date = Date(required=True, example="2022-08-06")
    time_range_id = Integer(required=True)


class BookMeetingOutSchema(Schema):
    meeting = Nested(AvailabilitySchema)
