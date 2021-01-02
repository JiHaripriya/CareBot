import pandas as pd
import sys

location=pd.read_csv('data_content.csv')
c=location['p_rating'].mean()
m=location['count'].quantile()


df=location.copy().loc[location['count'] >= m]

def weighted_rating(x, m=m, c=c):
    v = x['count']
    R = x['p_rating']
    # Calculation based on the IMDB formula
    return (v/(v+m) * R) + (m/(m+v) * c)

df['score']=df.apply(weighted_rating, axis=1)

df = df.sort_values('score', ascending=False)

emotions={'calm':['Pilgrimage','Heritage','Museum','Park'],'happy':['Pilgrimage','Heritage','Museum','Park'],'sad':['Park','Heritage'],'angry':['Park','Pilgrimage','Heritage'],'fear':['Pilgrimage','Heritage','Museum','Park'],'surprise':['Heritage'],'disgust':['Pilgrimage']}

emotion = str.lower(sys.argv[1].strip())
if emotions.get(emotion) :
    sub = emotions[emotion]
    result = df[['title','nearby_places']].head(0)
    for val in range(0, len(sub)):
        result = result.append(df[['title','nearby_places']][df['category'].str.contains(sub[val])])
            
    result.reset_index(drop=True, inplace=True)
    result['places'] = result['title'] + " :( " + result['nearby_places'] + " ) "
    print(result['places'].head(6).to_json())
else :
    print("error")
