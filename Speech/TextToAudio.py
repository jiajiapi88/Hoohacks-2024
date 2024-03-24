import ibm_watson
import os


import constants

from ibm_watson import TextToSpeechV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator


class TTS:

    def __init__(self):
        url = constants.WATSON_URL_TTS
        apikey = constants.WATSON_API_KEY_TTS

        authenticator = IAMAuthenticator(apikey)
        self.tts = TextToSpeechV1(authenticator=authenticator)
        self.tts.set_service_url(url)

    def to_audio(self, text, output='./output.mp3', is_play=True):
        print(f'Audio transcript: {text}')
        with open(output, 'wb') as audio_file:
            res = self.tts.synthesize(text, accept='audio/mp3', voice='en-US_AllisonV3Voice').get_result()
            audio_file.write(res.content)
        
        #play the output audio file
        #
        os.system(f"mpg123 {output}")

        # if is_windows:
        #     winsound.PlaySound(
        #         "output.mp3",
        #         winsound.SND_ALIAS
        #     )


