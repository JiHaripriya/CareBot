import sys
import pandas as pd
from rake_nltk import Rake

movies = pd.read_csv('mymovies.csv', encoding='utf-8-sig', dtype={'year': 'str'})

rake = Rake()

def get_keywords(x):
    rake.extract_keywords_from_text(x)
    return rake.get_ranked_phrases()


movies['keywords'] = movies.description.apply(lambda x: get_keywords(x))

movies['director'] = movies['director'].apply(lambda x: x.replace(" ", "") if x != '-' else ' ')

movies['writer'] = movies['writer'].apply(lambda x: x.replace(" ", "") if x != '-' else ' ')

movies['actors'] = movies['actors'].apply(lambda x: x.replace(" ", "") if x != '-' else ' ')

movies['production_company'] = movies['production_company'].apply(lambda x: x.replace(" ", "") if x != '-' else ' ')

mapping = {
    'documentary': 'calm, sad, happy, surprise, disgust',
    'short': 'calm, sad, happy, surprise, disgust',
    'animation':'happy, surprise',
    'comedy': 'happy',
    'romance': 'happy, surprise, calm',
    'sport': 'suprise, fearful',
    'news': 'surprise, disgust, fearful',
    'drama': 'sad, disgust',
    'fantasy': 'happy, surprise',
    'horror': 'surprise, fearful',
    'biography': 'calm, sad',
    'music': 'calm, happy, sad, angry, surprise',
    'war': 'fearful, disgust, sad',
    'crime': 'fearful, disgust',
    'western': 'surprise',
    'family': 'happy, calm',
    'adventure': 'happy, surprise',
    'history': 'calm, sad, disgust',
    'action': 'happy, suprise',
    'mystery': 'surprise',
    'sci-fi': 'surprise',
    'thriller': 'surprise, fearful',
    'musical': 'calm',
    'film-noir': 'sad, surprise, disgust',
    'game-show': 'happy, surprise',
    'talk-show': 'happy, surprise',
    'reality-tv': 'angry, sad, disgust, surprise',
    'adult': 'fearful, surprise, disgust'
}

set_error = False

def get_genres(emotion):
    genre_list = []
    for each_genre in mapping:
        if mapping[each_genre].find(emotion) != -1:
            genre_list.append(each_genre)
    if len(genre_list) == 0:
        set_error = True
    return genre_list

genres = get_genres(str.lower(sys.argv[1]))

def get_movies(genres):
    result = movies.head(0)
    movies['genre'] = movies['genre'].str.lower()
    
    # Fetch highest rated movies of each genre
    for genre in genres:
        trial = movies[movies['genre'].str.contains(genre)==True]
        
        trial.sort_values(by='avg_vote')
        result = result.append(trial.head(25))
    
    result.sort_values(by='avg_vote', ascending=True)
    result.reset_index(drop=True, inplace=True)
    return result

if set_error:
    print('error')
else:
    result = get_movies(genres)
    result.to_csv('result.csv', encoding='utf-8-sig', index=False)
    print(result.head(5).original_title.to_json())