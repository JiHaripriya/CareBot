import pickle
import sys
import numpy as np
import os, glob

import librosa
import soundfile

file_path = "./messages"

Pkl_Filename='Final_LR_Model.pkl'

with open(Pkl_Filename, 'rb') as file:
    Pickled_LR_Model = pickle.load(file)

x, y = [], []
    
for file in glob.glob(sys.argv[1]):

    mfcc=True
    chroma=True
    mel=True

    with soundfile.SoundFile(file) as sound_file:
        X = sound_file.read(dtype="float32")
        sample_rate = sound_file.samplerate
        if chroma:
            stft = np.abs(librosa.stft(X))
        result = np.array([])
        if mfcc:
            mfccs = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
            result = np.hstack((result, mfccs))
        if chroma:
            chroma = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)
            result = np.hstack((result, chroma))
        if mel:
            mel = np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T, axis=0)
            result = np.hstack((result, mel))

    x.append(result)
    p = np.array(x)
    
Ypredict = Pickled_LR_Model.predict(p)
print(Ypredict)