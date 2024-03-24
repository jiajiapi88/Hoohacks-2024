from langchain_community.document_loaders import WebBaseLoader
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from pymongo import MongoClient
from langchain_mongodb import MongoDBAtlasVectorSearch
import urllib

with open('journal.txt', 'r') as file:
    doc_content = file.read()

doc = [Document(page_content='doc_content')]  # A list with one Document object
splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=0,separators=["\n\n","\n","(?<=\.)"," "],length_function=len)
docs=splitter.split_documents(doc)
print(docs)

embeddings = OpenAIEmbeddings(openai_api_key='YOUR KEY')

username="jiajiapi88" 
pwd="hOQXXUNiPQ6ffape"

uri = "mongodb+srv://"+urllib.parse.quote_plus(username)+":"+urllib.parse.quote_plus(pwd)+"@hoohackcluster.a32ym9r.mongodb.net/?retryWrites=true&w=majority&appName=hoohackcluster"
client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
    
    collection=client["test"]["langchain"]
    docsearch=MongoDBAtlasVectorSearch.from_documents(docs,embeddings,collection=collection,index_name="meditation")
    print("documents are stored into mongodb vector store successfully")
except Exception as e:
    print(e)
