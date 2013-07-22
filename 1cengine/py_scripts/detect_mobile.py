# -*- coding:utf-8 -*-

import os

mobile_agent_list = [
    "sony",
    "symbian",
    "nokia",
    "samsung",
    "mobile",
    "windows ce",
    "epoc",
    "opera mini",
    "nitro",
    "j2me",
    "midp-",
    "cldc-",
    "netfront",
    "mot",
    "up.browser",
    "up.link",
    "audiovox",
    "blackberry",
    "ericsson",
    "panasonic",
    "philips",
    "sanyo",
    "sharp",
    "sie-",
    "portalmmm",
    "blazer",
    "avantgo",
    "danger",
    "palm",
    "series60",
    "palmsource",
    "pocketpc",
    "smartphone",
    "rover",
    "ipaq",
    "au-mic",
    "alcatel",
    "ericy",
    "up.link",
    "docomo",
    "vodafone/",
    "wap1.",
    "wap2.",
    "plucker",
    "480x640",
    "sec",
    "fennec",
    "android",
    "google wireless transcoder",
    "nintendo",
    "webtv",
    "playstation"
]

def detect():

    user_agent = os.environ["HTTP_USER_AGENT"].lower()

    for agent in mobile_agent_list:
        if agent in user_agent:
            return True
        else:
            return False