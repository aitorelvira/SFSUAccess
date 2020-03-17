module.exports = {
    apps: [
      {
        name: "authServer",
        script: "../server/authServer.js",
        watch: true,
        instances: 2,
        exec_mode: "cluster",
        ignore_watch : ["node_modules"],
        watch: true,
      },
      {
        name: "server",
        script: "../server/server.js",
        watch: true,
        ignore_watch : ["node_modules"],
        watch: true,
      },
      {
        name: "gateway",
        script: "../server/gateway.js",
        watch: true,
        ignore_watch : ["node_modules"],
        watch: true,
      },
    ]
  }