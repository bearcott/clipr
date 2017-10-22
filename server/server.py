from flask import Flask, request
import numpy as np
import cv2
import matplotlib.pyplot as plt
import urllib

import sys

app = Flask(__name__)

def url_to_image(url):
	# download the image, convert it to a NumPy array, and then read
	# it into OpenCV format
	resp = urllib.urlopen(url)
	image = np.asarray(bytearray(resp.read()), dtype="uint8")
	image = cv2.imdecode(image, cv2.IMREAD_COLOR)
 
	# return the image
	return image

def compareImages(base, template):
    base = url_to_image(base)
    template = url_to_image(template)

    orb = cv2.ORB_create()

    kp1, des1 = orb.detectAndCompute(template,None)
    kp2, des2 = orb.detectAndCompute(base,None)

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)

    matches = bf.match(des1,des2)
    matches = sorted(matches, key = lambda x:x.distance)

    result = reduce(lambda x,y: x+y, map(lambda x: x.distance, matches[:20])) / 20

    return result

    # img3 = cv2.drawMatches(template,kp1,base,kp2,matches[:10],None, flags=2)
    # plt.imshow(img3)
    # plt.show()


@app.route("/")
def hello():
    base = request.args.get('base')
    template = request.args.get('template')
    if type(base) != unicode or type(template) != unicode: 
        return 'no base or template specified'
    return str(compareImages(base, template))


@app.route('/comparelol')
def compareTest():
    template = request.args.get('template')
    for i in range(4,15):
        base = 'https://s3.amazonaws.com/clipr-thumbnails/all/tmobile%d.png'%(i)
        print(base)
        res = compareImages(base,template)
        if (res < 30.0):
            return "%s %i"%(base, res)
    return 'fail'



