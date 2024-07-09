resource "google_storage_bucket" "bucket" {
  name     = "mycloudscheduler-bucket"
  location = "US"
}

resource "google_storage_bucket_object" "archive" {
  name   = "index.zip"
  bucket = google_storage_bucket.bucket.name
  source = "./create_vm.js"
}

resource "google_cloudfunctions2_function" "function" {
  name        = "function-test"
	location 		= "us-central1"
  description = "schedulerdeployer"
	depends_on = [ google_cloud_scheduler_job.job, google_cloudfunctions_function_iam_member.invoker ]

	build_config {
		runtime     = "nodejs20"
		entry_point = "testpubsub"
		environment_variables = {
			MY_ENV_VAR = "my-env-var-value"
		}
		source {
			storage_source {
				bucket = google_storage_bucket.bucket.name
				object = google_storage_bucket_object.archive.name
			}
		}
	}

	service_config {
		max_instance_count = 1
		min_instance_count = 1
		available_memory = "128M"
		timeout_seconds = 60
		ingress_settings               = "ALLOW_INTERNAL_ONLY"
    all_traffic_on_latest_revision = true	
		service_account_email = "provisioning@swift-clarity-428809-s5.iam.gserviceaccount.com"
	}

	event_trigger {
		trigger_region = "us-central1"
		event_type = "google.cloud.pubsub.topic.v1.messagePublished"
		pubsub_topic = google_pubsub_topic.topicdata.id
		retry_policy   = "RETRY_POLICY_RETRY"
	}
}

# IAM entry for a single user to invoke the function
resource "google_cloudfunctions_function_iam_member" "invoker" {
  project        = google_cloudfunctions_function.function.project
  region         = google_cloudfunctions_function.function.region
  cloud_function = google_cloudfunctions_function.function.name

  role   = "roles/cloudfunctions.invoker"
  member = "serviceAccount:provisioning@swift-clarity-428809-s5.iam.gserviceaccount.com"
}