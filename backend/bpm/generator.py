import random

rand_bpm = 60

def get_next_bpm():
    global rand_bpm
    rand_bpm += random.randint(-5, 10)
    print(rand_bpm)
    rand_bpm = max(50, min(rand_bpm, 200))
    print(rand_bpm)
    return rand_bpm