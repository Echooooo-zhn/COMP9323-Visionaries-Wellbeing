from __future__ import print_function

from datetime import datetime, timedelta
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/calendar']
CREDENTIAL_PATH = Path(__file__).parent / "credentials.json"
TOKEN_PATH = Path(__file__).parent / 'token.json'


def create_meeting(expert_email, student_email, start_at, end_at):
    """
    Shows basic usage of the Google Calendar API.
    Prints the start and name of the next 10 events on the user's calendar.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(TOKEN_PATH, SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CREDENTIAL_PATH, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        service = build('calendar', 'v3', credentials=creds)

        event = {
            'summary': 'A Scheduled Meeting with Wellbeing Expert',
            'description': 'A chance to get your concerns and worries out of your head.',
            'start': {
                'dateTime': start_at.isoformat(),
                'timeZone': 'Australia/Sydney',
            },
            'end': {
                'dateTime': end_at.isoformat(),
                'timeZone': 'Australia/Sydney',
            },
            'attendees': [
                {'email': expert_email},
                {'email': student_email},
            ],
            "conferenceData": {
                "createRequest": {
                    "conferenceSolutionKey": {
                        "type": "hangoutsMeet"
                    },
                    "requestId": "SecureRandom.uuid"
                }
            },
        }

        # Call the Calendar API
        event = service.events().insert(calendarId='primary', body=event, conferenceDataVersion=1).execute()
        print(f"Event created: {event.get('htmlLink')}")
        return event.get('htmlLink')

    except HttpError as error:
        print('An error occurred: %s' % error)


def get_upcoming_events():
    now = datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    print('Getting the upcoming 10 events')
    events_result = service.events().list(calendarId='primary', timeMin=now,
                                          maxResults=10, singleEvents=True,
                                          orderBy='startTime').execute()
    events = events_result.get('items', [])

    if not events:
        print('No upcoming events found.')
        return

    # Prints the start and name of the next 10 events
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        print(start, event['summary'])


if __name__ == '__main__':
    create_meeting("haonanzhong17@gmail.com", "lplsz2000@gmail.com", datetime.now(),
                   datetime.now() + timedelta(hours=1))
