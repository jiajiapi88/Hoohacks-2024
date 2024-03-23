import ibm_watson
import os

from ibm_watson.speech_to_text_v1 import SpeechToTextV1
from playsound import playsound
import winsound

import constants

from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

class STT:

    def __init__(self):
        url = constants.WATSON_URL_STT
        apikey = constants.WATSON_API_KEY_STT

        authenticator = IAMAuthenticator(apikey)

        self.speech_to_text = SpeechToTextV1(authenticator=authenticator)
        self.speech_to_text.set_service_url(url)

    def recognize(self, fn: str):
        with open(fn, 'rb') as file:
            response = self.speech_to_text.recognize(audio=file, content_type="audio/wav")
            recognized_text = response.result['results'][0]['alternatives'][0]['transcript']
        return recognized_text

