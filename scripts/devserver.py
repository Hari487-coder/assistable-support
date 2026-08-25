"""
Static server for local work, with caching turned off.

`python -m http.server` sends Last-Modified and no Cache-Control, so Chrome
applies heuristic caching to ES modules. Editing a component and reloading then
runs the old one, which looks exactly like a change that did not work: the file
on disk is right, the served bytes are right, and the page is executing
something else. That cost two wrong diagnoses before it was spotted.

Nothing here belongs in production. GitHub Pages sends its own validators.
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *_args):
        pass


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
    print(f"serving with no-store on :{port}")
    ThreadingHTTPServer(("127.0.0.1", port), NoCache).serve_forever()
