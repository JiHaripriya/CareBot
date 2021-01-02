import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import sys

songs=pd.read_csv('moodsongs.csv')

columns=['name','album','artist','release_date','popularity','mood']

songs['popularity']=songs['popularity'].astype(str)

def get_important_features(song):
    important_features=[]
    for i in range(0,song.shape[0]):
        important_features.append(song['name'][i]+' '+song['album'][i]+' '+song['artist'][i]+' '+song['release_date'][i]+' '+str(song['danceability'][i])+' '+song['mood'][i] + ' '+str(song['energy'][i]))
    
    return important_features


songs['important_features']=get_important_features(songs)

mapping = {
    'Calm': 'Calm',
    'Happy': 'Happy',
    'Sad': 'Sad',
    'Angry': 'Calm,Energetic',
    'Fearful': 'Calm',
    'Suprise': 'Energetic,Happy',
    'Disgust': 'Happy,Energetic,Calm'
}

set_error = False

def get_emotions(emotion):
    emotion_list = []
    if mapping.get(emotion):
        for i in mapping[emotion].split(','):
            emotion_list.append(i)
    else:
        set_error = True
    return emotion_list


def get_songs(moodList):
    result = songs.head(0)
   
    # Fetch highest rated movies of each genre
    for mood in moodList:
        trial = songs[songs['mood']==mood]
        result = result.append(trial)
        
    result.sort_values(by='popularity', ascending=False)
    result.reset_index(drop=True, inplace=True)
    return result


def get_recommendations(title, cs):
    
    # Get the index of the movie that matches the title
    idx = songs[songs['album'] == title].index.tolist()[0]

    # Get the pairwsie similarity scores of all movies with that movie
    sim_scores = list(enumerate(cs[idx]))
       
    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 10 most similar movies
    sim_scores = sim_scores[1:11]

    # Get the movie indices
    indices = [i[0] for i in sim_scores]

    # Return the top 10 most similar movies
    return songs['album'].iloc[indices]


emotions = get_emotions(sys.argv[1])


req_songs = get_songs(emotions)
req_songs.to_csv('result_song.csv', encoding='utf-8-sig', index=False)

songs=pd.read_csv('result_song.csv', encoding='utf-8-sig')
cv=CountVectorizer(stop_words='english')
cm=cv.fit_transform(songs['important_features'])
cs=cosine_similarity(cm)

song_rec = get_recommendations(songs.head(1).album.tolist()[0], cs)
print(song_rec.to_json())