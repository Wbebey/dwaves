######
###
# Creation of Google Cloud Storage bukets & policies
###
######

# Dwaves logging bucket
resource "google_storage_bucket" "dwaves-logging-bucket" {
  name          = "dwaves-logs"
  project       = google_project.dwaves.project_id
  location      = var.gcp-region
  storage_class = "REGIONAL"
  force_destroy = true

  uniform_bucket_level_access = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 30
    }
  }

  labels = {
    "id"         = "dwaves"
    "managed-by" = "terraform"
    "department" = "epitech"
    "purpose"    = "logging"
  }
}

# Define the environments and their associated bucket configurations
locals {
  environments = {
    staging = {
      buckets = [
        "dwaves-staging.tonfrere.fr",
        "dwaves-app-staging.tonfrere.fr",
      ]
    },
    production = {
      buckets = [
        "dwaves.tonfrere.fr",
        "dwaves-app.tonfrere.fr",
      ]
    },
    test = {
      buckets = [
        "dwaves-test.tonfrere.fr",
        "dwaves-app-test.tonfrere.fr",
      ]
    }
  }
}

# Create a map of bucket configurations for each environment
locals {
  bucket_configs = merge([
    for env, values in local.environments : {
      for bucket in values.buckets : "${bucket}" => {
        name              = "${bucket}"
        log_object_prefix = "${bucket}/"
        labels = {
          id         = "dwaves"
          managed-by = "terraform"
          department = "epitech"
          env        = "${env}"
        }
      }
    }
  ]...)
}

# Create the buckets and associated access controls for each environment
resource "google_storage_bucket" "dwaves_buckets" {
  for_each = local.bucket_configs

  name          = each.value.name
  project       = google_project.dwaves.project_id
  location      = var.gcp-region
  storage_class = "REGIONAL"
  force_destroy = true

  uniform_bucket_level_access = false

  versioning {
    enabled = true
  }
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET"]
    response_header = ["*"]
    max_age_seconds = 60
  }

  logging {
    log_bucket        = google_storage_bucket.dwaves-logging-bucket.name
    log_object_prefix = each.value.log_object_prefix
  }

  labels = each.value.labels
}

# Create IAM policies to grant public access to the buckets
resource "google_storage_bucket_iam_member" "dwaves_buckets_public_access" {
  for_each = local.bucket_configs

  bucket = each.value.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"

  depends_on = [
    google_storage_bucket.dwaves_buckets
  ]
}

# Create bucket access controls to grant public access to the buckets
resource "google_storage_bucket_access_control" "dwaves_buckets_acl" {
  for_each = local.bucket_configs

  bucket = each.value.name
  role   = "READER"
  entity = "allUsers"

  depends_on = [
    google_storage_bucket.dwaves_buckets
  ]
}