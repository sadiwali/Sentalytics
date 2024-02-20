import nltk
from nltk.stem import WordNetLemmatizer
from nltk.sentiment.sentiment_analyzer import SentimentAnalyzer
import pandas as pd
import array
import numpy as np
import re
import string

stopwords = nltk.corpus.stopwords.words('english') + ['rt', 'via']
lmtzr = WordNetLemmatizer()
ps = nltk.PorterStemmer()
sa = SentimentAnalyzer()


def process_text(text: 'str') -> ['str']:
    ''' Remove punctuation, remove stop-words, removes verbs, then lemmatize.
    '''
    # remove punctuation
    text = "".join([word.lower()
                    for word in text if word not in string.punctuation + '’'])
    # tokenize
    tokens = nltk.word_tokenize(text)
    # remove stopwords
    no_stop_words = [token for token in tokens if token not in stopwords]
    # lemmatize
    lemmatized = [lmtzr.lemmatize(token) for token in no_stop_words]
    return lemmatized
   

text = "I tried! the mobile deposit on the app, and it says the money was added to my account and then removed right afterward. I normally go to a branch to deposit my cheques so I don’t know if this is normal, but it’s frustrating not knowing what’s going on."

print(sa.classify(process_text(text)))
