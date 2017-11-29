const { events, Job } = require("brigadier")

events.on("exec", (e, p) => {

  //debug info
  console.log("==> Project " + p.name + " clones the repo at " + p.repo.cloneURL)
  console.log("==> Event " + e.type + " caused by " + e.provider)


  // create job with name and container image to use
  var kb_job = new Job("kb-job", "quay.io/charter-os/kolla-brigade:0.1.0")

  // allow docker socket
  kb_job.docker.enabled = true

  //set up tasks
  kb_job.tasks = [] //init empty tasks

  kb_job.tasks.push("source /src/start.sh") // add first task - build kolla container

  kb_job.tasks.push("source /src/push.sh") // add next task - push image to registry

  //kb_job.tasks.push("./src/cleanup.sh") // add final task - clean up image

  //set up ENV
  // TODO: SECRETS
  kb_job.env = {
    "KOLLA_BASE": "ubuntu",
    "KOLLA_TYPE": "source",
    "KOLLA_TAG": "3.0.2-kb",
    "KOLLA_PROJECT": "keystone",
    "KOLLA_NAMESPACE": "charter-os",
    "KOLLA_VERSION": "3.0.2",
    "DOCKER_USER": "user",
    "DOCKER_PASS": "pass",
    "DOCKER_REGISTRY": "quay.io",
    "REPO_BASE": "https://github.com/openstack",
    "PROJECT_REFERENCE": "stable/newton",
    "PROJECT_GIT_COMMIT": "4892f35575bde78c612088a388fbf50c7f19f9e7",
    "RELEASE": "stable-newton"
  }


  console.log("==> Set up tasks, env, Job: ")
  console.log(kb_job)

  console.log("==> Running Job")

  // run Job, get Promise and print results
  kb_job.run().then( result => {
    console.log("==> Job Results")
    console.log(result.toString())
    console.log("==> Done")
  })

  

})