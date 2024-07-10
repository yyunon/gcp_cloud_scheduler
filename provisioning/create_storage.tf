data "archive_file" "functionsource" {
	type = "zip"
	output_path = "./function_source.zip"

	source {
    filename = "function.js"
    content  = file("./cloud_function/function.js")
  }

  source {
    filename = "package.json"
    content  = file("./cloud_function/package.json")
  }
}

# Create new storage bucket in the US
# location with Standard Storage

resource "google_storage_bucket" "static" {
 name          = "mycloudscheduler-bucket"
 location      = "US"
 storage_class = "STANDARD"

 uniform_bucket_level_access = true
}

# Upload a text file as an object
# to the storage bucket

resource "google_storage_bucket_object" "default" {
 name         = "function_source.zip"
 source       = "./function_source.zip"
 content_type = "text/plain"
 bucket       = google_storage_bucket.static.id
}