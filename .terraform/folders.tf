######
###
# Creation of Google Cloud Folder
###
######

resource "google_folder" "epitech" {
  display_name = "Epitech"
  parent       = "organizations/${var.gcp-org-id}"
}