import text2emotion as te
import sys

def textemo(input_line):
    emo_list=te.get_emotion(input_line)
    result = str(max(emo_list, key=emo_list.get) )
    return result 

print(textemo(sys.argv[1]))