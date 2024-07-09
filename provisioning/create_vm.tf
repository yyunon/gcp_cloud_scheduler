# Create a VM instance from a public image
# in the `default` VPC network and subnet

resource "google_compute_instance" "default" {
  name         = "mycloudscheduler-vm"
  machine_type = "f1-micro"

  metadata = {
   google-logging-enabled="true"  
	 gce-container-declaration = "spec:\n  containers:\n    - name: instance-4\n      image: 'us-central1-docker.pkg.dev/swift-clarity-428809-s5/mycloudscheduler/functest'\n      stdin: false\n      tty: false\n  restartPolicy: Always\n"
  }

	scheduling {
		automatic_restart = true
	}

  boot_disk {
    initialize_params {
      image = "ubuntu-minimal-2210-kinetic-amd64-v20230126"
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

	service_account {
		email = "provisioning@swift-clarity-428809-s5.iam.gserviceaccount.com"
		scopes = ["cloud-platform"]
	}

}