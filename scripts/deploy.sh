#!/bin/bash
BUILD_JS_DIR=build/static/js
BUILD_CSS_DIR=build/static/css

if [ -z ${APPS} ]; then
    echo "APPS not specified, supply a comma seperated list of apps to deploy"
    exit 1
fi

if [ ! -d "$BUILD_JS_DIR" ]; then
    echo "JS DIR not found: $BUILD_JS_DIR. Run yarn build"
    exit 1
fi

if [ ! -d "$BUILD_CSS_DIR" ]; then
    echo "CSS DIR not found: $BUILD_CSS_DIR. Run yarn build"
    exit 1
fi

DEPLOY_APPS=(${APPS//,/ })
CDN_PATHS=""



for i in "${!DEPLOY_APPS[@]}"
do
    APP="${DEPLOY_APPS[i]}"
    APP_JS_DIR=${BUILD_JS_DIR}/${APP}
    APP_CSS_DIR=${BUILD_JS_DIR}/${APP}

    echo "Deploying $APP"
    echo ""
    echo "  Cloudfront ID: $AWS_CLOUDFRONT_ID"
    echo "  Bucket: $AWS_S3_BUCKET"
    echo ""

    mkdir -p $APP_JS_DIR
    mkdir -p $APP_CSS_DIR

    # mv ${BUILD_JS_DIR}/${APP}.*.js.map ${APP_JS_DIR}/${APP}.js.map
    mv ${BUILD_JS_DIR}/${APP}.js ${APP_JS_DIR}/
    mv ${BUILD_JS_DIR}/${APP}.*.js ${APP_JS_DIR}/
    mv ${BUILD_CSS_DIR}/*.css ${APP_CSS_DIR}/

    if [ $? -eq 0 ]
    then
        aws s3 sync ${APP_JS_DIR} s3://${AWS_S3_BUCKET}/client/${APP}/js --cache-control max-age=691200
        aws s3 sync ${APP_CSS_DIR} s3://${AWS_S3_BUCKET}/client/${APP}/css --cache-control max-age=691200
        CDN_PATHS="$CDN_PATHS /client/${APP}/*"
    else
        echo "Could not find built assets for $APP, ensure yarn build"
    fi
done

if [ "${CDN_PATHS}" ]; then
    echo "Invalidate Cloudfront: $CDN_PATHS"
    aws cloudfront create-invalidation --distribution-id ${AWS_CLOUDFRONT_ID} --paths ${CDN_PATHS}
fi
