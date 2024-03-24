#!/usr/bin/env python
import json
from fastapi import FastAPI
from fastapi import UploadFile, File, HTTPException
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


class VectorStore:
    def __init__(self):
        self.vectorstore = FAISS(dimensions=OpenAIEmbeddings().model_embedding_size)
        self.embeddings = OpenAIEmbeddings()

    def add(self, documents: List[str]):
        # Embed the documents
        embeddings = self.embeddings.embed_texts(documents)
        # Add the embeddings to the vector store
        for embedding in embeddings:
            self.vectorstore.add([embedding])

    def retrieve(self, query: str, top_k: int = 10):
        # Embed the query
        query_embedding = self.embeddings.embed_texts([query])[0]
        # Retrieve top_k closest embeddings from the vector store
        distances, indices = self.vectorstore.search([query_embedding], k=top_k)
        return indices[0]  # Assuming you want the indices of the documents

vector_store = VectorStore()

# Load onboarding text
with open("onboarding.txt", "r") as file:
    onboarding = file.read()


def add_documents_to_vectorstore(documents: List[str]):
    # This function takes a list of strings (documents)
    # and adds their embeddings to the vector store.
    vector_store.add(documents)

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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.post("/add_documents")
async def add_documents(documents: List[str]):
    try:
        add_documents_to_vectorstore(documents)
        return {"message": "Documents added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add documents: {e}")
    

@app.post("/add_documents")
async def add_documents(file: UploadFile = File(...)):
    if file.content_type != 'application/json':
        raise HTTPException(status_code=400, detail="File must be JSON.")
    try:
        contents = await file.read()
        documents = json.loads(contents)
        # Assuming documents is a list of texts
        add_documents_to_vectorstore(documents)
        return {"message": "Documents added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add documents: {e}")

from propelauth_fastapi import init_auth

API_KEY_AUTH = "ce551a35849b7391b250992e71e85bd3ddd5650fbc851115f8e4f609a2049fc61fa9d21be380db13eaaa50018f17b865"
AUTH_URL = "https://677600144.propelauthtest.com"
ISSUER = "https://677600144.propelauthtest.com"

auth = init_auth(AUTH_URL, API_KEY_AUTH)

@app.get("/login")
async def login():
    return await auth.login()


@app.get("/retrieve_meditation")
async def retrieve_meditation(query: str):
    try:
        # Here, the query is passed to the retriever; adjust according to your actual logic
        retrieved_context = retriever.retrieve(query, top_k=1)[0]  # Assuming you want the top result
        # Pass the retrieved context to your existing chain or a modified version
        meditation_script = retrieval_chain.invoke({"context": retrieved_context, "question": query})
        return meditation_script
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retrieval failed: {e}")


# @app.get("/{wish_id}")
# async def get_meditation(wish_id: str):
#     logger.info(f"Retrieving initial if {wish_id}")
#     existing_wish = 
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
