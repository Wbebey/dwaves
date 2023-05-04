#!/bin/bash

# This script is used to setup requirement for pre-commit hooks for the project.
# It is assumed that the script is run from the root of the project.

set -euxo pipefail

install_pre_commit() {
    if ! [ -x "$(command -v pre-commit)" ]
    then
        echo "Installing pre-commit"
        # pip install ggshield || pip3 install ggshield
        # pip install python-dotenv || pip3 install python-dotenv
        pip install pre-commit || pip3 install pre-commit
    else
        echo "pre-commit is already installed"
    fi
    pip install ggshield || pip3 install ggshield
    pip install python-dotenv || pip3 install python-dotenv
    pre-commit install 
}

main() {
    install_pre_commit
}

main