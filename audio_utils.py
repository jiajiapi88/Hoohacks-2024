import sounddevice as sd
import numpy as np
import wave
import time


def record_audio(filename="recording.wav", samplerate=44100, channels=2):
    print("Press Enter to start recording")
    input()  # Wait for the user to press Enter
    print("Recording... Press Enter to stop.")

    # Start recording
    myrecording = sd.rec(int(samplerate * 10), samplerate=samplerate, channels=channels, dtype='float64')
    input()  # Wait for the user to press Enter to stop recording
    sd.stop()
    print("Recording stopped. Saving...")

    # Save recording as WAV file
    with wave.open(filename, 'w') as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(2)
        wf.setframerate(samplerate)
        # Convert float64 array to int16
        wav_data = np.int16((myrecording / np.max(np.abs(myrecording))) * 32767)
        wf.writeframes(wav_data.tobytes())
    print(f"File saved as {filename}")


if __name__ == "__main__":
    record_audio()
