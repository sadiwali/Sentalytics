import nltk
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
import re
import string

lmtzr = WordNetLemmatizer()
stopwords = nltk.corpus.stopwords.words('english')
ps = nltk.PorterStemmer()


def clean_text(text: 'str') -> ['str']:
    ''' Remove punctuation, remove stop-words, removes verbs, then lemmatize.
    '''
    # tokenize
    text = "".join([word.lower()
                    for word in text if word not in string.punctuation])
    tokens = re.split(r'\W+', text)

    text = " ".join([lmtzr.lemmatize(word) for word in [token for token in tokens if not ('VB' == nltk.pos_tag(token)[0][1][0:2]) if word not in stopwords]])
    return text


text = "I tried the mobile deposit on the app, and it says the money was added to my account and then removed right afterward. I normally go to a branch to deposit my cheques so I don’t know if this is normal, but it’s frustrating not knowing what’s going on."



print(nltk.pos_tag(nltk.word_tokenize(clean_text(text))))

