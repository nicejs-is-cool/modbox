@echo off
mkdir production
copy manifest.json production
mkdir production\dist
copy dist\* production\dist\
mkdir production\web
copy web\* production\web\
