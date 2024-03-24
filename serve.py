#!/usr/bin/env python
from typing import List

from fastapi import FastAPI
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_community.document_loaders import WebBaseLoader
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.tools.retriever import create_retriever_tool
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_openai import ChatOpenAI
from langchain import hub
from langchain.agents import create_openai_functions_agent
from langchain.agents import AgentExecutor
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.messages import BaseMessage
from langserve import add_routes
import constants
import os

from langchain.chat_models import ChatAnthropic, ChatOpenAI

from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware

os.environ['OPENAI_API_KEY'] = constants.OPENAI_API_KEY
os.environ['LANGCHAIN_API_KEY'] = constants.LANGCHAIN_API_KEY
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["TAVILY_API_KEY"] = constants.TAVILY_API_KEY
os.environ["ANTHROPIC_API_KEY"] = constants.ANTHROPIC_API_KEY

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using Langchain's Runnable interfaces",
)

add_routes(
    app,
    ChatOpenAI(),
    path="/openai",
)
add_routes(
    app,
    ChatAnthropic(),
    path="/anthropic",
)

model = ChatOpenAI(model="gpt-3.5-turbo")
prompt = ChatPromptTemplate.from_template("tell me a joke about {topic}")
add_routes(
    app,
    prompt | model,
    path="/joke",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

class JokeRequest(BaseModel):
    text: str
    sender: str

@app.post("/joke/")
async def get_joke(request: JokeRequest):
    # Your logic to process the request and generate a response
    response_text = "This is a joke response."
    return {"text": response_text}

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)