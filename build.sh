#!/bin/bash
cd "$(dirname "$0")"
cat build/00-head.html build/01-hero-p1.html build/02-timeline.html build/02b-kings.html build/03-p3-p5.html \
    build/04-p6-p7.html build/05-p8-creeds.html build/06-p9-p10.html build/07-p11-memory.html \
    build/07b-p12-visual.html build/08-appendix.html \
    build/90-data-ot.js build/91-data-nt.js build/92-data-extra.js build/93-data-cards.js \
    build/94-behavior.js build/99-close.html > site/index.html
