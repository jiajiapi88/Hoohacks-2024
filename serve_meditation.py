#!/usr/bin/env python
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langserve import add_routes
import constants
import os
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.embeddings import QuantizedBiEncoderEmbeddings

#from your_application import TTS  # Assuming you have a TTS module


os.environ['OPENAI_API_KEY'] = constants.OPENAI_API_KEY
os.environ['LANGCHAIN_API_KEY'] = constants.LANGCHAIN_API_KEY
os.environ["LANGCHAIN_TRACING_V2"] = "true"

# Initialize the FastAPI app
app = FastAPI(
    title="Meditation Script Generator",
    version="1.0",
    description="API server for generating customized meditation scripts",
)

# Load onboarding text
with open("onboarding.txt", "r") as file:
    onboarding = file.read()

# Setup vectorstore and retriever
vectorstore = FAISS.from_texts(
    [onboarding], embedding=OpenAIEmbeddings()
)
retriever = vectorstore.as_retriever()

#QuantizedBiEncoderEmbeddings()

# Setup prompt and model
template = """Produce a meditation script within 100 words to help the user achieve their goal using the following context:
{context}
"""
prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI(model="gpt-4")

# Define the retrieval chain as a runnable
retrieval_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | model
    | StrOutputParser()
)

# Expose the retrieval chain as an API endpoint
add_routes(
    app,
    retrieval_chain,
    path="/generate_meditation",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# @app.get("/{wish_id}")
# async def get_meditation(wish_id: str):
#     logger.info(f"Retrieving initial if {wish_id}")
#     customized_meditation = retrieval_chain.invoke(f"Produce a customized meditation script for wish_id={wish_id}")
#     print(customized_meditation)
#     # tts = TTS()
#     # tts.to_audio(customized_meditation, "meditation.mp3")
#     return customized_meditation

# Add a Text-to-Speech endpoint if needed
# For this, you would need to wrap your TTS functionality into a LangChain Runnable

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
