'use strict';
const functions = require('@google-cloud/functions-framework');
const Compute = require('@google-cloud/compute');

async function createInstance() {
  // Change this const value to your project
  const projectId = 'swift-clarity-428809-s5';
  const zone = 'us-central1-c';
  const vmName = 'mycloudscheduler-vm' + Date.now();

  console.log(`Creating instance ${vmName} in zone ${zone}`);
  const compute = new Compute.InstancesClient();

  const vmConfig = {
    name: vmName, 
    machineType: `zones/${zone}/machineTypes/f1-micro`,
    metadata: {
      items: [
        {
          key: 'google-logging-enabled',
          value: 'true',
        },
        {
          key: "gce-container-declaration",
          value: "spec:\n  containers:\n  - name: instance-20240709-145149\n    image: us-central1-docker.pkg.dev/swift-clarity-428809-s5/mycloudscheduler/functest\n    stdin: false\n    tty: false\n  restartPolicy: Always\n# This container declaration format is not public API and may change without notice. Please\n# use gcloud command-line tool or Google Cloud Console to run Containers on Google Compute Engine."
        }
      ]
    },
    disks: [
      {
        type: 'PERSISTENT',
        boot: true,
        autoDelete: true,
        initializeParams: {
          sourceImage: `projects/debian-cloud/global/images/debian-12-bookworm-v20240709`,
          diskSizeGb: '10'
        },
      }
    ],
    networkInterfaces: [
      {
        // Use the network interface provided in the networkName argument.
        name: 'global/networks/default',
      },
    ],
    deletionProtection: false,
    serviceAccounts: [
      {
        email: `provisioning@${projectId}.iam.gserviceaccount.com`,
        scopes: [
          'https://www.googleapis.com/auth/cloud-platform'
        ]
      }
    ]
  }


  compute.insert({
    instanceResource: vmConfig,
    zone: zone,
    project: projectId,
  }).then(response => {
    let operation  = response[0].latestResponse;
    const operationsClient = new Compute.ZoneOperationsClient();

    operationsClient.wait({
      operation: operation.name,
      project: projectId,
      zone: operation.zone.split('/').pop(),
    }).then(() => {
      console.log("VM created with success.")
    });
  });
}

createInstance();