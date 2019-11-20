from PIL import Image
import os, sys

path = "/Users/mogen/Documents/Code/lethality/app/http/app/src/img/cards/"
dirs = os.listdir( path )

def resize():
    for item in dirs:
        if os.path.isfile(os.path.join(path,item)):
            im = Image.open(path+item)
            f, e = os.path.splitext(path+item)
            imResize = im.resize((150,225), Image.ANTIALIAS)
            imResize.save(f + '-sm.png', "PNG")
            print("resized ", f+"-sm.png")

resize()
print("done")