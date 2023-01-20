##!/usr/bin/env bash

function get_environment_properties() {
    if [[ ${GITHUB_REF} == refs/heads/feature/*  ]]
    then
        export ENVIRONMENT="production"
        export ENV_VARS="${DWAVES_API_PRODUCTION_ENV}"
        export DOCKER_TAG="gcr.io/${GCP_PROJECT_ID }/${APP}-$ENVIRONMENT:${GITHUB_REF}-${GITHUB.SHA}"
    else
        export ENVIRONMENT="staging"
        export ENV_VARS="${DWAVES_API_STAGING_ENV}"
        export DOCKER_TAG="gcr.io/${GCP_PROJECT_ID }/${APP}-$ENVIRONMENT:${GITHUB_REF}-${GITHUB.SHA}"
}