
resource "google_cloudfunctions2_function" "function" {
  name        = "function-test"
	location 		= "us-central1"
  description = "schedulerdeployer"
	depends_on = [ google_cloud_scheduler_job.job ]

	build_config {
		runtime     = "nodejs20"
		entry_point = "createScheduledInstance"
		source {
			storage_source {
				bucket = google_storage_bucket.static.name
				object = google_storage_bucket_object.default.name
			}
		}
	}

	service_config {
		max_instance_count = 1
		min_instance_count = 1
		available_memory = "256M"
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