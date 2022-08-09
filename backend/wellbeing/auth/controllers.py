import json
import re
from datetime import datetime, timezone
from functools import wraps

from apiflask import abort
from flask import current_app
from flask_jwt_extended import create_access_token, get_jwt, verify_jwt_in_request
from tencentcloud.common import credential
from tencentcloud.common.exception.tencent_cloud_sdk_exception import TencentCloudSDKException
from tencentcloud.common.profile.client_profile import ClientProfile
from tencentcloud.common.profile.http_profile import HttpProfile
from tencentcloud.ocr.v20181119 import ocr_client, models

from wellbeing.QA.models import Category
from wellbeing.auth.models import TokenBlocklist
from wellbeing.extensions import db
from wellbeing.extensions import jwt
from wellbeing.user.models import User

'''
JWT
'''


@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None


def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims['account_type'] != 'admin':
                abort(401, 'Admin required')
            return current_app.ensure_sync(fn)(*args, **kwargs)

        return decorator

    return wrapper


'''
Authentication
'''


def register(data):
    """Register a new user."""
    if User.query.filter_by(email=data['email']).first():
        abort(409, 'User with the same email already exists.')

    user = User(**data)
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return {'user': user.serialized,
            'access_token': create_access_token(user, additional_claims={'account_type': user.account_type})}


def login(data):
    """Login a user."""
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return {'user': user.serialized,
                'access_token': create_access_token(user,
                                                    additional_claims={'account_type': user.account_type})}
    abort(401, 'Invalid email or password')


def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return {'message': 'User logged out'}


def register_expert_account(data):
    if User.query.filter_by(email=data['email']).first():
        abort(409, 'User with the same email already exists.')

    user = User(
        username=data['username'],
        email=data['email'],
        account_type='expert',
    )
    user.set_password(data['password'])

    if 'interested_category_ids' in data:
        user.interested_categories = Category.query.filter(
            Category.id.in_(data['interested_category_ids'])).all()

    db.session.add(user)
    db.session.commit()
    return {'user': user.serialized,
            'access_token': create_access_token(user, additional_claims={'account_type': user.account_type})}


def card_recognizer(data):
    try:

        secretId = 'AKIDVord8MJzOWNxGJ6duud5F9m8D1YonWy9'
        secretKey = 'vay5vUmnXzB6k7E5fT1JK3VhcGchV2IH'
        cred = credential.Credential(secretId, secretKey)

        httpProfile = HttpProfile()
        httpProfile.endpoint = "ocr.tencentcloudapi.com"

        clientProfile = ClientProfile()
        clientProfile.httpProfile = httpProfile

        client = ocr_client.OcrClient(cred, "ap-singapore", clientProfile)

        req = models.GeneralBasicOCRRequest()
        params = {
            "ImageBase64": data['base64url'],
            "LanguageType": "zh_rare"
        }
        req.from_json_string(json.dumps(params))

        resp = client.GeneralBasicOCR(req)
        resp = resp.to_json_string()
        resp_json = json.loads(resp)

        type = ''
        id = ''
        first_name = ''
        last_name = ''
        detected_list = resp_json['TextDetections']

        zid_pattern = r'\d{7}'
        first_name_pattern = r'[A-Z][a-z]+'
        last_name_pattern = r'[A-Z]{3,}'
        first_name_parag = None

        for detect in detected_list:
            info = detect['AdvancedInfo']
            text = detect['DetectedText']

            if text == 'STUDENT':
                type = 'student'
            elif text == 'STAFF':
                type = 'staff'
            elif re.match(zid_pattern, text):
                id = text
            elif re.match(first_name_pattern, text):
                first_name = text
                first_name_parag = int(info[-3])

        if first_name_parag is not None:
            last_info = "{\"Parag\":{\"ParagNo\":" + \
                        str(first_name_parag + 1) + "}}"
            for detect in detected_list:
                info = detect['AdvancedInfo']
                text = detect['DetectedText']
                if re.match(last_name_pattern, text) and info == last_info:
                    last_name = text

        return {'id': id, 'name': f'{first_name} {last_name}', 'type': type}

    except TencentCloudSDKException as err:
        print(err)
        abort(501, 'Recognize Error: No content found!')
