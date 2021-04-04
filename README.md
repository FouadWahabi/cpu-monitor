# cpu-monitor

This application monitors the CPUs usage and load average. It provides metrics, visualizations and real-time alerts to analyze and monitor the host machine CPUs.

![cpu-monitor](demo.gif "cpu-monitor")

## Requirements 

The project was designed and is intended to run on a [Unix-Like](https://en.wikipedia.org/wiki/Unix-like) operating system.

To be able to run this application locally, please make sure your have:

* [Git](https://git-scm.com/)
* [Node.js (>= 14)](https://nodejs.org)
* [Yarn](https://yarnpkg.com)

For simplicity we also provide an installation through Docker. To be able to use Docker please make sure you have `Docker` and `docker-compose` installed on your machine.

## Installation
### Without using Docker

Before we can run the server and the dashbaord, we need to install all the dependencies.

Install the server dependencies :
```
cd server
yarn install --pure-lockfile
```

Install the dashboard dependencies :
```
cd dashboard
yarn install --pure-lockfile
```

Once the commands have finished, we can start running our server and dashboard:

Run the server :
```
cd server
yarn start
```

Run the dashboard :
```
cd dashboard
yarn start
```

*NOTE*: We also provide a `Makefile` to make it easier to build and run the project.

Run the porject using `Make` :

```
make deps
make run
```

### With using Docker

Use `docker-compose` to run the application :
```
docker-compose up
```

## Testing
### Automated mock testing

We have an automated mock testing written using `jest` testing framework.

Run the automated tests:
```
cd dashboard
yarn test
```

or simply use make:
```
make test
```

These tests will mock CPU metrics and check if the dashboard displays correctly the alerts (high load alert and recover alert).

### Live stress testing

Before running the live stress tests please make sure that the prject is perfectly running and accessible from the browser: [http://localhost:4100](http://localhost:4100).

You will need three commands :
* [stress](https://linux.die.net/man/1/stress)
* [timeout](https://linux.die.net/man/1/timeout)
* [nproc](https://linux.die.net/man/1/nproc)

Run the live stress testing:
```
timeout 3m stress --cpu $(nproc --all)
```
This command will produce a high load on the CPUs. Watch the dashboard to track the metrics.

## Project structure

The project is split into two parts: [server](./server), [dashboard](./dashboard).

### Server
The server is responsible for collecting and storing metrics in a [timeseries](https://en.wikipedia.org/wiki/Time_series) structure.
Following are the different parts of the server:
* **Monitors**:
A monitor is a runnable module that exports a `metrics` method. This method returns metrics in a timeseries format:
```
[
  {
    metric1: value1,
    metric2: value2,
    ...
    timestamp: timestamp
  },
  ...
]
```

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;All the monitors should be in the [./server/monitors](./server/monitors) directory to be loaded automatically during the server startup.

* **Data storage**:
The data storage is responsible for storing and retrieving the timeseries data.
Here's an example of a file data storage system: [./server/core/db.js](./server/core/db.js).
This data storage creates a directory tree based on the timestamp and splits over the metrics.
Following is an example:
```
- metrics-db
  - 2021                      # year
    - 2                       # month
      - 31                    # day
        - 12                  # hour
          - cpu_monitor.idle  # cpu_monitor idle metric
          - cpu_monitor.load  # cpu_monitor load metric
          - cpu_monitor.total # cpu_monitor total metric
```

### Dashboard
The dashboard is a React application that displays the metrics during specific time period.
The dashboard provides 2 KPIs:

* **CPU Usage Percentage**: this KPI is displayed in two formats: a live CPU percentage and a line chart that shows the history of the CPU usage percentage over time.

* **CPU Load Average**: this KPI is displayed in two formats: a live CPU load average and a line chart that shows the history of the CPU load average over time.

The dashboard triggers two type of alerts:

  * **High Load Alert**: a CPU is considered under "high load" when its average load value exceeds the threshold for a period of 2 minutes or more.
  * **Recover Alert**: a CPU is considered recovered from high load when its average load value drops below threshold for 2 minutes or more.

**CUSTOMIZATION**:

* Flexible layout: The dashboard is a flexible grid layout. The size and the position of all the charts is customizable.
* Customize environements variables: `BACKEND_URL` to change the data source.
`HIGH_LOAD_THRESHOLD` to edit the high load threshold (the default value is 1).

## Improvements

* Add support to different data sources and different popular data formats like [prometheus](https://prometheus.io/).
* Send alerts by SMS and/or email.
* Customize themes,colors and chart types and add the ability to save current customization.
* Add authentication and permission management so that the metrics won't be publicly exposed.
