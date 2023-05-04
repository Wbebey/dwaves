#!/usr/bin/env bash

set -euxo pipefail

function properties() {
    # project directories
    local_directory=$(pwd)
    api_directory=$(pwd)/backend/api
    jobs_directory=$(pwd)/backend/jobs
    smart_contracts_directory=$(pwd)/backend/smart-contracts
    app_directory=$(pwd)/frontend/dwaves-app
    website_directory=$(pwd)/frontend/dwaves-website

    directories=(
        "$api_directory"
        "$jobs_directory"
        "$smart_contracts_directory"
        "$app_directory"
        "$website_directory"
    )
}

function install_doppler() {
    if ! command -v doppler &> /dev/null
    then
        echo "Installing doppler"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install gnupg
            brew install dopplerhq/cli/doppler
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl gnupg
            curl -sLf --retry 3 --tlsv1.2 --proto "=https" 'https://packages.doppler.com/public/cli/gpg.DE2A7741A397C129.key' | sudo apt-key add -
            echo "deb https://packages.doppler.com/public/cli/deb/debian any-version main" | sudo tee /etc/apt/sources.list.d/doppler-cli.list
            sudo apt-get update && sudo apt-get install doppler
        fi
    else
        echo "doppler is already installed"
    fi
}

function doppler_setup() {
    properties
    # Log in to Doppler using your credentials
    # doppler login

    for project in "${directories[@]}"
    do
        cd "$project"
        doppler setup --config doppler.yaml  --no-interactive
        cd "$local_directory"
    done
}

main() {
    install_doppler
    doppler_setup
}

main