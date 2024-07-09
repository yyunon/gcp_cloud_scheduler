resource "google_pubsub_topic" "topicdata" {
  name = "mycloudscheduler-topic"
}

resource "google_cloud_scheduler_job" "job" {
  name        = "mycloudscheduler-job"
  description = "mycloudscheduler job"
  schedule    = "0 8 * * *"
	depends_on = [ google_pubsub_topic.topicdata ]

  pubsub_target {
    # topic.id is the topic's full resource name.
    topic_name = google_pubsub_topic.topicdata.id
    data       = base64encode("test")
  }
}