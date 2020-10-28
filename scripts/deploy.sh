#!/bin/bash
BUILD_JS_DIR=build/client/js
BUILD_CSS_DIR=build/client/css
BUILD_APP_DIR=build

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

if [ ! -d "$BUILD_APP_DIR" ]; then
    echo "APP DIR not found: $BUILD_APP_DIR. Run yarn build"
    exit 1
fi

# echo ""
# echo "  Deploying..."
# echo ""
# echo "  Cloudfront ID: $AWS_CLOUDFRONT_ID"
# echo "  Bucket: $AWS_S3_BUCKET"
# echo ""

# aws s3 sync ${BUILD_JS_DIR} s3://${AWS_S3_BUCKET}/client/js
# aws s3 sync ${BUILD_CSS_DIR} s3://${AWS_S3_BUCKET}/client/css
# CDN_PATHS="$CDN_PATHS /client/*"

# if [ "${CDN_PATHS}" ]; then
#     echo "Invalidate Cloudfront: $CDN_PATHS"
#     aws cloudfront create-invalidation --distribution-id ${AWS_CLOUDFRONT_ID} --paths ${CDN_PATHS}
# fi

echo ""
echo "  Deploying App..."
echo ""
echo "  Cloudfront ID: $AWS_CLOUDFRONT_APP_ID"
echo "  Bucket: $AWS_S3_APP_BUCKET"
echo ""

aws s3 sync ${BUILD_JS_DIR} s3://${AWS_S3_BUCKET}/client/js --delete
aws s3 sync ${BUILD_CSS_DIR} s3://${AWS_S3_BUCKET}/client/css --delete
aws s3 sync ${BUILD_APP_DIR} s3://${AWS_S3_APP_BUCKET}
CDN_PATHS="$CDN_PATHS /*"

if [ "${CDN_PATHS}" ]; then
    echo "Invalidate Cloudfront: $CDN_PATHS"
    aws cloudfront create-invalidation --distribution-id ${AWS_CLOUDFRONT_APP_ID} --paths ${CDN_PATHS}
fi
