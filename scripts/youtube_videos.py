"""List a YouTube channel's recent videos as [videoId, title] pairs.

Reads a saved Atom feed or a saved channel page and writes JSON to stdout.

youtube.com/feeds/videos.xml was the original source, but it now answers 404
for every channel — YouTube's own and Google's included — so the channel page
is the working path and the feed is only tried in case it comes back. The page
no longer uses videoRenderer either: the current layout puts each video in a
lockupViewModel keyed by contentId. Both shapes are handled so a rollback on
either side keeps working.

Usage:  python3 scripts/youtube_videos.py feed /tmp/feed.xml
        python3 scripts/youtube_videos.py page /tmp/videos.html
"""

import json
import re
import sys

VIDEO_ID = re.compile(r'^[0-9A-Za-z_-]{11}$')


def from_feed(path):
    import xml.etree.ElementTree as ET

    ns = {'a': 'http://www.w3.org/2005/Atom', 'yt': 'http://www.youtube.com/xml/schemas/2015'}
    root = ET.parse(path).getroot()
    out = []
    for e in root.findall('a:entry', ns):
        vid = e.find('yt:videoId', ns)
        title = e.find('a:title', ns)
        if vid is not None and vid.text:
            out.append((vid.text, (title.text if title is not None else '') or ''))
    return out


def _balanced(s, start):
    """Return the JSON object that begins at s[start] == '{'."""
    depth = 0
    instr = esc = False
    for i in range(start, len(s)):
        c = s[i]
        if instr:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                instr = False
        elif c == '"':
            instr = True
        elif c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return s[start:i + 1]
    raise ValueError('unbalanced ytInitialData object')


def _title_of(node):
    """Pull a display title out of a renderer or view model, whatever its shape."""
    if isinstance(node, str):
        return node
    if not isinstance(node, dict):
        return ''
    if isinstance(node.get('content'), str):
        return node['content']
    if isinstance(node.get('simpleText'), str):
        return node['simpleText']
    runs = node.get('runs')
    if isinstance(runs, list):
        return ''.join(r.get('text', '') for r in runs if isinstance(r, dict))
    for v in node.values():
        t = _title_of(v)
        if t:
            return t
    return ''


def from_page(path):
    html = open(path, encoding='utf-8', errors='replace').read()
    m = re.search(r'ytInitialData"?\]?\s*=\s*', html)
    if not m:
        raise ValueError('no ytInitialData on the channel page')
    data = json.loads(_balanced(html, html.index('{', m.end())))

    out = []

    def walk(n):
        if isinstance(n, dict):
            lockup = n.get('lockupViewModel')
            if isinstance(lockup, dict) and VIDEO_ID.match(str(lockup.get('contentId', ''))):
                out.append((lockup['contentId'], _title_of(lockup.get('metadata'))))
            for key in ('videoRenderer', 'gridVideoRenderer'):
                vr = n.get(key)
                if isinstance(vr, dict) and VIDEO_ID.match(str(vr.get('videoId', ''))):
                    out.append((vr['videoId'], _title_of(vr.get('title'))))
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    walk(data)
    return out


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ('feed', 'page'):
        sys.exit(__doc__)
    entries = (from_feed if sys.argv[1] == 'feed' else from_page)(sys.argv[2])

    seen = set()
    videos = []
    for vid, title in entries:
        if vid and vid not in seen:
            seen.add(vid)
            videos.append([vid, title or vid])
    json.dump(videos, sys.stdout, ensure_ascii=False)


if __name__ == '__main__':
    main()
