terraform {
  required_version = ">= 1.1.3"
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
}

provider "google" {
  region      = var.gcp-region
  credentials = file(var.gcp-auth-file)
}
