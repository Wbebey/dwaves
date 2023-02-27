# ######
###
# Creation of Google Cloud Projects for School purpose
###
######

# Dwaves Projects
resource "google_project" "dwaves" {
  name            = "dwaves"
  project_id      = var.gcp-dwaves-project-id
  folder_id       = google_folder.epitech.name
  billing_account = var.gcp-billing-account-id
  labels = {
    "managed-by" = "terraform"
    "department" = "epitech"
    "id"         = "dwaves"
  }
}