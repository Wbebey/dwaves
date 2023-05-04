#!/bin/bash

# This script is used to setup requirement for pre-commit hooks for the project.
# It is assumed that the script is run from the root of the project.

set -euxo pipefail

# Install pre-commit hooks
install_pre_commit() {
    # Install pre-commit  if necessary
    if ! [ -x "$(command -v pre-commit)" ]
    then
        echo "Installing pre-commit"
        pip install pre-commit || pip3 install pre-commit
    else
        echo "pre-commit is already installed"
    fi

    pre-commit install 
}

main() {
    install_pre_commit
}

main