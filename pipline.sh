#!/bin/bash
file_name="src/index.jsx"
msg="update"

if [[ ! -z $1 ]];then
    msg=$1
fi

fmt_date=`date "+%Y-%m-%d %H:%M:%S"`
tf="console.log('%c【UPDATE TIME】-> ${fmt_date}','color:#5FD068;margin-left: 20%;padding: 20px;');"
gsed -i -e '$s/console.log(.*);/'"$tf"'/' ${file_name}


git add .
git commit -m "$msg"
git push

npm run build
rm -rf ../githubpages/*
cp -r ./dist/* ../githubpages/
cp -r ./assets/*.xlsx ../githubpages/TABLE
cd ../githubpages/

git add . 
git commit -m "$msg"
git push