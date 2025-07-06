import os
import pandas as pd
import re
import psycopg2
import matplotlib.pyplot as plt
from sqlalchemy import create_engine

def create_connection():
  conn = psycopg2.connect(
    database = os.getenv('DB_NAME'),
    host = os.getenv('DB_HOST'),
    user = os.getenv('DB_USER'),
    password = os.getenv('DB_PASSWORD'),
    port = os.getenv('DB_PORT')
  )
  cursor = conn.cursor()
  return conn, cursor

def get_topic_data():
  engine_name = f"postgresql://{os.getenv('CEB_DB_USER')}:{os.getenv('CEB_DB_PASSWORD')}@{os.getenv('CEB_DB_HOST')}:{os.getenv('CEB_DB_PORT')}/{os.getenv('CEB_TOPIC_DB_NAME')}"
  engine = create_engine(engine_name)

  query_sql = "SELECT * FROM topic_data"
  df = pd.read_sql_query(query_sql, con=engine)
  return df

def display_topic_data(df):
  label_counts = df['topic'].value_counts().sort_index()
  print(label_counts)
  plt.bar(label_counts.index, label_counts.values, color=['blue','red','green','yellow','orange','purple'])
  plt.xticks(label_counts.index, ['business','food','gaming','politics','sport','tech'])  
  plt.xlabel('Label')
  plt.ylabel('Count')
  plt.title('Count of Labels')
  plt.show()

def get_bias_data():
  engine_name = f"postgresql://{os.getenv('CEB_DB_USER')}:{os.getenv('CEB_DB_PASSWORD')}@{os.getenv('CEB_DB_HOST')}:{os.getenv('CEB_DB_PORT')}/{os.getenv('CEB_BIAS_DB_NAME')}"
  engine = create_engine(engine_name)

  query_sql = "SELECT * FROM fb_data"
  df = pd.read_sql_query(query_sql, con=engine)
  return df

def display_bias_data(df):
  label_counts = df['source'].value_counts().sort_index()
  plt.bar(label_counts.index, label_counts.values, color=['blue', 'red', 'green'])
  plt.xticks(label_counts.index, ['left', 'right', 'center'])  
  plt.xlabel('Label')
  plt.ylabel('Count')
  plt.title('Count of Labels')
  plt.show()

def process_text(text):
  TAG_RE = re.compile(r'<[^>]+>')
  URL_RE = re.compile(r'http[s]?://\S+')
  text = URL_RE.sub('', text)
  text = TAG_RE.sub('',text)
  text = re.sub('[^a-zA-Z]', ' ', text)
  text = re.sub(r"\s+[a-zA-Z]\s+", ' ', text)
  text = re.sub(r'\s+', ' ', text).strip()
  return text

def extract_new_tokens(texts, tokenizer):
  all_tokens = set()
  new_tokens = set()
  
  for text in texts:
      tokens = re.findall(r'\b\w+\b', text)  
      all_tokens.update(tokens)
  
  for token in all_tokens:
      if token.lower() not in tokenizer.vocab:  
          new_tokens.add(token)
  
  return list(new_tokens)

