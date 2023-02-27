terraform {
  # cloud {
  #   organization = "yakow"

  #   workspaces {
  #     name = "dwaves"
  #   }
  # }

  backend "gcs" {
    bucket = "dwaves-gcp-terraform-state"
    prefix = "terraform-state"
  }
}

resource "google_storage_bucket" "terraform-state-dwaves" {
  project       = google_project.dwaves.project_id
  name          = "${google_project.dwaves.name}-gcp-terraform-state"
  location      = var.gcp-region
  storage_class = "REGIONAL"

  versioning {
    enabled = true
  }

  labels = {
    "managed-by" = "terraform"
    "department" = "epitech"
    "status"     = "critical"
    "id"         = "dwaves"
  }
}