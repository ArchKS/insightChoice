#!/bin/bash

msg="update"
if [[ ! -z $1 ]];then
    msg=$1
fi

git add .
git commit -m "$msg"
git push

npm run build
cp -r ./build/* ../githubpages/
cd ../githubpages/

git add . 
git commit -m "$msg"
git push