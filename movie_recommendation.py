import sys
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

result = pd.read_csv('result.csv', encoding='utf-8-sig', dtype={'year': 'str'})
result.drop_duplicates(subset='original_title', keep='first', inplace=True)

metaData = result.apply(
    lambda x: ' '.join(x['director'].split(',')) + ' '  + 
              ' '.join(x['actors'].split(',')) + ' ' + 
              ' '.join(x['genre'].split(',')) + ' ' + ' '.join(x['language']) + ' ' + ' '.join(x['keywords'])
    , axis = 1)

vectorizer = CountVectorizer(stop_words='english')

count = vectorizer.fit_transform(metaData)

cosine_sim = cosine_similarity(count, count)

# Function that takes in movie title as input and outputs most similar movies
def get_recommendations(title, cosine_sim):
    
    # Get the index of the movie that matches the title
    idx = result[result['original_title'] == title].index.tolist()[0]

    # Get the pairwsie similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim[idx]))
       
    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 10 most similar movies
    sim_scores = sim_scores[1:11]

    # Get the movie indices
    movie_indices = [i[0] for i in sim_scores]

    # Return the top 10 most similar movies
    return result['original_title'].iloc[movie_indices]


if str(sys.argv[1]).strip() == "":
    print('error')
else:
    movies = get_recommendations(str(sys.argv[1]).strip(), cosine_sim).to_json()
    print(movies)
