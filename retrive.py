from langchain_community.document_loaders import WebBaseLoader
from langchain_openai import ChatOpenAI,OpenAIEmbeddings
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain.retrievers import ContextualCompressionRetriever
from pymongo import MongoClient
import urllib

llm=ChatOpenAI(model="gpt-4",temperature=0,openai_api_key='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')
compressor=LLMChainExtractor.from_llm(llm)
embeddings = OpenAIEmbeddings(openai_api_key='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')

client=MongoClient()
username="jiajiapi88" 
pwd="hOQXXUNiPQ6ffape"

uri = "mongodb+srv://"+urllib.parse.quote_plus(username)+":"+urllib.parse.quote_plus(pwd)+"@hoohackcluster.a32ym9r.mongodb.net/?retryWrites=true&w=majority&appName=hoohackcluster"
client = MongoClient(uri)


try:
    client.admin.command('ping')
    collection=client["test"]["langchain"]
    vs=MongoDBAtlasVectorSearch(collection,embeddings,index_name="meditation")
    cr=ContextualCompressionRetriever(base_compressor=compressor, base_retriever=vs.as_retriever())
    cd=cr.get_relevant_documents("meditation")
    if cd:
        print(cd[0].page_content)
        print("========================================================")
    else:
        print("No documents found matching the search criteria.")
except Exception as e:
    print(e)

