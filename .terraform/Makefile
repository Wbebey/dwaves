# Make file to run easyly things you need

SHELL = /bin/bash

terraform_folder = ./
secrets_folder = ./secrets/dwaves

init:
	terraform -chdir="$(terraform_folder)" fmt -write=true -recursive && \
	terraform -chdir="$(terraform_folder)" init -upgrade

plan:
	terraform -chdir="$(terraform_folder)" fmt -write=true -recursive && \
	terraform -chdir="$(terraform_folder)" init && \
	terraform -chdir="$(terraform_folder)" plan -var-file=$(secrets_folder)/secrets.tfvars 

apply:
	terraform -chdir="$(terraform_folder)" fmt -write=true -recursive && \
	terraform -chdir="$(terraform_folder)" init && \
	terraform -chdir="$(terraform_folder)" apply -var-file=$(secrets_folder)/secrets.tfvars 

import:
	terraform -chdir="$(terraform_folder)" init && \
	terraform -chdir="$(terraform_folder)" import -var-file=$(secrets_folder)/secrets.tfvars  $(resource) $(id)

.PHONY: init  plan  apply 