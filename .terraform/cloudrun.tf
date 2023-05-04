######
###
# Creation of Google Cloud run ressources
###
######

# Cloud Run for dwaves-api-test
resource "google_cloud_run_service" "dwaves-api-test-service" {
  project  = google_project.dwaves.project_id
  name     = "dwaves-api-test"
  location = var.gcp-region

  metadata {
    namespace = google_project.dwaves.project_id
    labels = {
      "id"         = "dwaves"
      "managed-by" = "terraform"
      "department" = "epitech"
      "env"        = "test"
    }
  }

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "iam-run-dwaves-api-test" {
  project  = google_cloud_run_service.dwaves-api-test-service.project
  service  = google_cloud_run_service.dwaves-api-test-service.name
  location = google_cloud_run_service.dwaves-api-test-service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_domain_mapping" "dns-dwaves-api-test" {
  project  = google_project.dwaves.project_id
  name     = "dwaves-api-test.tonfrere.fr" # TODO: Change to make it secrets
  location = google_cloud_run_service.dwaves-api-test-service.location
  metadata {
    namespace = google_project.dwaves.project_id
  }
  spec {
    route_name = google_cloud_run_service.dwaves-api-test-service.name
  }
}

# Cloud Run for dwaves-api-production
resource "google_cloud_run_service" "dwaves-api-production-service" {
  project  = google_project.dwaves.project_id
  name     = "dwaves-api-production"
  location = var.gcp-region

  metadata {
    namespace = google_project.dwaves.project_id
    labels = {
      "id"         = "dwaves"
      "managed-by" = "terraform"
      "department" = "epitech"
      "env"        = "production"
    }
  }

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "iam-run-dwaves-api-production" {
  project  = google_cloud_run_service.dwaves-api-production-service.project
  service  = google_cloud_run_service.dwaves-api-production-service.name
  location = google_cloud_run_service.dwaves-api-production-service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_domain_mapping" "dns-dwaves-api-production" {
  project  = google_project.dwaves.project_id
  name     = "dwaves-api.tonfrere.fr" # TODO: Change to make it secrets
  location = google_cloud_run_service.dwaves-api-production-service.location
  metadata {
    namespace = google_project.dwaves.project_id
  }
  spec {
    route_name = google_cloud_run_service.dwaves-api-production-service.name
  }
}

# Cloud Run for dwaves-api-staging
resource "google_cloud_run_service" "dwaves-api-staging-service" {
  project  = google_project.dwaves.project_id
  name     = "dwaves-api-staging"
  location = var.gcp-region

  metadata {
    namespace = google_project.dwaves.project_id
    labels = {
      "id"         = "dwaves"
      "managed-by" = "terraform"
      "department" = "epitech"
      "env"        = "staging"
    }
  }

  template {
    spec {
      containers {
        image = "gcr.io/cloudrun/hello"
      }
    }
  }
  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow unauthenticated users to invoke the service
resource "google_cloud_run_service_iam_member" "iam-run-dwaves-api-staging" {
  project  = google_cloud_run_service.dwaves-api-staging-service.project
  service  = google_cloud_run_service.dwaves-api-staging-service.name
  location = google_cloud_run_service.dwaves-api-staging-service.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_domain_mapping" "dns-dwaves-api-staging" {
  project  = google_project.dwaves.project_id
  name     = "dwaves-api-staging.tonfrere.fr" # TODO: Change to make it secrets
  location = google_cloud_run_service.dwaves-api-staging-service.location
  metadata {
    namespace = google_project.dwaves.project_id
  }
  spec {
    route_name = google_cloud_run_service.dwaves-api-staging-service.name
  }
}

