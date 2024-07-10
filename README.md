# Cloud Scheduler Template
This repository holds a template for cloud scheduling with automated provisioning via terraform. 

![System Design](https://github.com/yyunon/gcp_cloud_scheduler/blob/master/docs/systemdesign.png "System Design")

# Prerequisites
* A machine with working gcloud cli
* A machine with terraform installed
* A machine with docker installed
 
## A Service Account
* Create a gcp auth with service account for provisioning
* Activate the service account via cli

## API Services to Enable
* Enable Identity and Access Management API 
* Enable Compute Engine API
* Enable Cloud SQL Admin API
* Enable Cloud Pub/Sub API
* Enable Cloud Scheduler API
* Enable Cloud Logging API

# Publishing code to Google Artifactory
Follow the following guide:
https://cloud.google.com/artifact-registry/docs/docker/pushing-and-pulling


https://cloud.google.com/sql/docs/mysql/connect-instance-compute-engine
