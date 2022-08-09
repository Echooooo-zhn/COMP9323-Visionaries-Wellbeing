from wellbeing.extensions import db


class Availability(db.Model):
    """
    expert_id, time_range_id, date forms the Primary Key
    """
    expert_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True, index=True)
    time_range_id = db.Column(db.Integer, db.ForeignKey('time_range.id'), primary_key=True, index=True)
    date = db.Column(db.Date, primary_key=True, index=True)

    status = db.Column(db.Enum('available', 'unavailable', 'booked'), nullable=False)

    # Not null only if status == 'booked'
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True, index=True)
    meeting_metadata = db.Column(db.Text, nullable=True)

    # Relationships
    student = db.relationship('User', foreign_keys=[student_id], lazy=True, uselist=False,
                              back_populates='availability_as_student')
    expert = db.relationship('User', foreign_keys=[expert_id], lazy=True, uselist=False,
                             back_populates='availability_as_expert')
    time_range = db.relationship('TimeRange', lazy=False, uselist=False, back_populates='availabilities')

    @property
    def serialized(self):
        value = {
            'expert_id': self.expert_id,
            'time_range': self.time_range.serialized,
            'date': self.date,
            'status': self.status,
        }
        if self.status == 'booked':
            value['student_id'] = self.student_id
            value['meeting_metadata'] = self.meeting_metadata

        return value


class TimeRange(db.Model):
    __tablename__ = 'time_range'
    id = db.Column(db.Integer, primary_key=True)
    start_at = db.Column(db.Time, nullable=False)
    end_at = db.Column(db.Time, nullable=False)

    availabilities = db.relationship('Availability', lazy=True, uselist=True, back_populates='time_range')

    @property
    def serialized(self):
        return {
            'id': self.id,
            'start_at': self.start_at,
            'end_at': self.end_at,
        }
