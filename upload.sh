#!/bin/bash

rsync -a --exclude "node_modules" . root@aimixer.io:/home/node-qdrant/