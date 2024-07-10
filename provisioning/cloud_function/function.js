'use strict';
const functions = require('@google-cloud/functions-framework');
const compute = require('@google-cloud/compute');

// Change this const value to your project
const projectId = 'swift-clarity-428809-s5';
const zone = 'us-central1-c';

const vmConfig = {
  kind: 'compute#instance',
  zone: `projects/${projectId}/zones/${zone}`,
  machineType: `projects/${projectId}/zones/${zone}/machineTypes/f1-micro`,
  displayDevice: {
    enableDisplay: false
  },
  metadata: {
    kind: 'compute#metadata',
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
  tags: {
    items: []
  },
  disks: [
    {
      kind: 'compute#attachedDisk',
      type: 'PERSISTENT',
      boot: true,
      mode: 'READ_WRITE',
      autoDelete: true,
      deviceName: 'instance-1',
      initializeParams: {
        sourceImage: `projects/debian-cloud/global/images/debian-9-stretch-v20190729`,
        diskType: `projects/${projectId}/zones/${zone}/diskTypes/pd-standard`,
        diskSizeGb: '10'
      },
      diskEncryptionKey: {}
    }
  ],
  canIpForward: false,
  networkInterfaces: [
    {
      kind: 'compute#networkInterface',
      subnetwork: `projects/${projectId}/regions/us-central1/subnetworks/default`,
      accessConfigs: [
        {
          kind: 'compute#accessConfig',
          name: 'External NAT',
          type: 'ONE_TO_ONE_NAT',
          networkTier: 'PREMIUM'
        }
      ],
      aliasIpRanges: []
    }
  ],
  description: '',
  labels: {},
  scheduling: {
    preemptible: false,
    onHostMaintenance: 'MIGRATE',
    automaticRestart: true,
    nodeAffinities: []
  },
  deletionProtection: false,
  reservationAffinity: {
    consumeReservationType: 'ANY_RESERVATION'
  },
  serviceAccounts: [
    {
      email: `provisioning@${projectId}.iam.gserviceaccount.com`,
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform'
      ]
    }
  ]
}

exports.createScheduledInstance = (event, context) => {
  const vmName = 'mycloudscheduler-vm' + Date.now();
  try {
    compute.zone(zone)
      .createVM(vmName, vmConfig)
      .then(data => {
        // Operation pending.
        const vm = data[0];
        const operation = data[1];
        console.log(`VM being created: ${vm.id}`);
        console.log(`Operation info: ${operation.id}`);
        return operation.promise();
      })
      .then(() => {
        const message = 'VM created with success, Cloud Function finished execution.';
        console.log(message);
      })
      .catch(err => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};