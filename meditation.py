from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
import constants
import os

from Speech.TextToAudio import TTS

os.environ['OPENAI_API_KEY'] = constants.OPENAI_API_KEY

# load onboarding.txt as a string with the variable name onboarding
with open("onboarding.txt", "r") as file:
    onboarding = file.read()

print(onboarding)

vectorstore = FAISS.from_texts(
    [onboarding], embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()
template = """Produce a meditation script within 100 words to help the user achieve their goal using the following context:
{context}
"""
prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI(model = "gpt-4")

retrieval_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

customized_meditation = retrieval_chain.invoke("Produce a customized meditation script")

print(customized_meditation)

tts = TTS()

tts.to_audio(customized_meditation, "meditation.mp3")