##!/usr/bin/env bash

function get_environment_properties() {
    BRANCH_NAME=${GITHUB_REF#refs/heads/}
    BRANCH_NAME=${BRANCH_NAME//\//-}

    if [[ ${GITHUB_REF} == refs/heads/main  ]]
    then
        export ENVIRONMENT="production"
        export ENV_NAME="prd"
        export DOPPLER_TOKEN="${DOPPLER_TOKEN_PRD}"
        export BUCKET_NAME="${PRODUCTION_URL}"
        export DOCKER_TAG="gcr.io/${GCP_PROJECT_ID}/${APP}-$ENVIRONMENT:$BRANCH_NAME-${GITHUB_SHA}"
    elif [[ ${GITHUB_REF} == refs/heads/staging ]]
    then
        export ENVIRONMENT="staging"
        export ENV_NAME="stg"
        export DOPPLER_TOKEN="${DOPPLER_TOKEN_STG}"
        export BUCKET_NAME="${STAGING_URL}"
        export DOCKER_TAG="gcr.io/${GCP_PROJECT_ID}/${APP}-$ENVIRONMENT:$BRANCH_NAME-${GITHUB_SHA}"
    else
        export ENVIRONMENT="test"
        export ENV_NAME="test"
        export DOPPLER_TOKEN="${DOPPLER_TOKEN_TEST}"
        export BUCKET_NAME="${TEST_URL}"
        export DOCKER_TAG="gcr.io/${GCP_PROJECT_ID}/${APP}-$ENVIRONMENT:$BRANCH_NAME-${GITHUB_SHA}"
    fi
}

function doppler_setup() {
    get_environment_properties
    echo "Setting up Doppler"
    curl --request GET \
     --url "https://api.doppler.com/v3/configs/config/secrets/download?project=${APP}&config=$ENV_NAME&format=env" \
     --header 'accept: application/json' \
     --header "authorization: Bearer $DOPPLER_TOKEN" > .env
}