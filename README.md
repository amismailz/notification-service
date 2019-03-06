## Notification Service
A standalone service has features to send notifications to mobile phones either by push notification or SMS.

**Technology stack:**

 - The service is built in docker containers
 - API is built with **Loopback** nodejs api framework
 - MongoDB
 - RabbitMQ
 - Firebase is used for push notifications

**Set up**

   Clone the source code and then inside the source directory type:
   

    ./scripts/run.dev.sh
Hence, the service will be running on http://localhost:3000

**API Docs**

http://localhost:3000/explorer

**Testing:**

 - Run the app in testing environment using `./scripts/run.testing.sh`
 - Run tests using command `./scripts/tests.sh`
