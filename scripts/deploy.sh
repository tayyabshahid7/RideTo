#!/bin/bash

JS_DIRECTORY=build/static/js
CSS_DIRECTORY=build/static/css
APP=widget

if [ ! -d "$JS_DIRECTORY" ]; then
    echo "JS DIR not found: $JS_DIRECTORY. Run yarn build"
    exit 1
fi

if [ ! -d "$CSS_DIRECTORY" ]; then
    echo "CSS DIR not found: $CSS_DIRECTORY. Run yarn build"
    exit 1
fi

echo "Deploying $APP"

cp ${JS_DIRECTORY}/${APP}.*.js ${JS_DIRECTORY}/${APP}.js
cp ${JS_DIRECTORY}/${APP}.*.js.map ${JS_DIRECTORY}/${APP}.js.map
cp ${CSS_DIRECTORY}/${APP}.*.css ${CSS_DIRECTORY}/${APP}.css

aws s3 sync ${JS_DIRECTORY} s3://${AWS_S3_BUCKET}/client/${APP}/js --cache-control max-age=691200
aws s3 sync ${CSS_DIRECTORY} s3://${AWS_S3_BUCKET}/client/${APP}/css --cache-control max-age=691200

aws cloudfront create-invalidation --distribution-id ${AWS_CLOUDFRONT_ID} --paths "/client/widget/*"
