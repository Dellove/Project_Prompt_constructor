import sys
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import wordnet
from textblob import TextBlob
import re
from nltk.corpus import stopwords

nltk.download('averaged_perceptron_tagger', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)

def count_grammar_errors_with_errors(text):
    tokens = word_tokenize(text.lower())
    tagged_words = nltk.pos_tag(tokens)
    grammar_errors = 0
    error_words = []

    for word, tag in tagged_words:
        if tag.startswith('V'):
            if not wordnet.synsets(word, pos=wordnet.VERB):
                grammar_errors += 1
                error_words.append(word)
        elif tag.startswith('N'):
            if not wordnet.synsets(word, pos=wordnet.NOUN):
                grammar_errors += 1
                error_words.append(word)
        elif tag.startswith('J'):
            if not wordnet.synsets(word, pos=wordnet.ADJ):
                grammar_errors += 1
                error_words.append(word)
        elif tag.startswith('R'):
            if not wordnet.synsets(word, pos=wordnet.ADV):
                grammar_errors += 1
                error_words.append(word)

    return grammar_errors, error_words

def analyze_sentiment(text):
    blob = TextBlob(text)
    avg_sentiment = blob.sentiment.polarity
    if avg_sentiment > 0:
        overall_sentiment = "positive"
    elif avg_sentiment < 0:
        overall_sentiment = "negative"
    else:
        overall_sentiment = "neutral"
    return overall_sentiment, avg_sentiment

def text_quality_analysis(text):
    tokens = word_tokenize(text.lower())
    num_words = len(tokens)
    num_chars = len(text)
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word.isalnum() and word not in stop_words]
    sentence_lengths = [len(re.findall(r'\w+', sent)) for sent in nltk.sent_tokenize(text)]
    avg_sentence_length = sum(sentence_lengths) / len(sentence_lengths)
    unique_words = set(tokens)
    lexical_diversity = len(unique_words) / num_words
    grammar_errors, error_words = count_grammar_errors_with_errors(text)
    sentiment_score = analyze_sentiment(text)

    analysis_results = {
        "num_words": num_words,
        "num_chars": num_chars,
        "avg_sentence_length": avg_sentence_length,
        "lexical_diversity": lexical_diversity,
        "grammar_errors": grammar_errors,
        "sentiment_score": sentiment_score,
        "error_words": error_words
    }

    return analysis_results

if __name__ == "__main__":
    text = ' '.join(sys.argv[1:])
    analysis_results = text_quality_analysis(text)
    print(json.dumps(analysis_results, ensure_ascii=False))

