module.exports = {
  "apps" : [
    {
      "name"        : "api",
      "script"      : "/api/server/server.js",
      "watch"       : process.env.NODE_ENV === 'production' ? false : ["/api/server/"],
      "ignore_watch": [
        "/api/node_modules/", 
        "*.log"
      ],
      "watch_options": {
        "awaitWriteFinish": true
      },
      "autorestart" : true
    }
  ]
}