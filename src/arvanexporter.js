const ArvanClient = require('./arvanclient')
const Prometheus = require('prom-client')
const { UPDATE_INTERVAL, METRICS_PREFIX } = require('./config')
const Promise = require('bluebird')
const logger = require('pino')()

class CDNExporter {
  constructor(apiKey, domains, mode) {
    this.mode = mode
    this.domains = domains
    this.arvanClient = new ArvanClient(apiKey)

    this.updateMetricsError = new Prometheus.Counter({
      name: `${METRICS_PREFIX}update_metrics_error`,
      help: 'number of errors',
      labelNames: ['domain'],
    })

    this.requests = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}requests`,
      help: 'request counts',
      labelNames: ['domain', 'cache_type'],
    })

    this.traffic = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}traffic`,
      help: 'traffic served',
      labelNames: ['domain', 'cache_type'],
    })

    this.visitors = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}visitors`,
      help: 'unique visitors',
      labelNames: ['domain'],
    })

    this.highRequestIps = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}high_request_ips`,
      help: 'top ips with highest requests',
      labelNames: ['domain', 'ip'],
    })

    this.requestsByCountry = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}requests_by_country`,
      help: 'request counter by country',
      labelNames: ['domain', 'country_code', 'country_name'],
    })

    this.trafficByCountry = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}traffic_by_country`,
      help: 'request counter by country',
      labelNames: ['domain', 'country_code', 'country_name'],
    })

    this.responseTime = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}response_time`,
      help: 'response time',
      labelNames: ['domain'],
    })

    this.requestByStatus = new Prometheus.Gauge({
      name: `${METRICS_PREFIX}requests_by_status`,
      help: 'requests by status code',
      labelNames: ['domain', 'status'],
    })

    if (mode === 'PASSIVE') {
      this.updateMetrics()
      setInterval(() => this.updateMetrics(), UPDATE_INTERVAL)
    }
  }

  async scrapeMetrics() {
    if (this.mode === 'ACTIVE') {
      await this.updateMetrics()
    }
    return Prometheus.register.metrics()
  }

  async updateMetrics() {
    await Promise.map(this.domains, async (domain) => {
      try {
        const trafficReport = await this.arvanClient.getTrafficReport(domain)
        const visitorsReport = await this.arvanClient.getUniqueVisitorsReport(domain)
        const highRequestIpReport = await this.arvanClient.getHighRequestIps(domain)
        const geoRequestReport = await this.arvanClient.getGeoTrafficReport(domain)
        const responseTimeReport = await this.arvanClient.getResponseTimeReport(domain)
        const statusCodeReport = await this.arvanClient.getStatusCodeReport(domain)

        this.requests.labels(domain, 'MISS').set(trafficReport.requests.total - trafficReport.requests.saved)
        this.requests.labels(domain, 'HIT').set(trafficReport.requests.saved)
        this.traffic.labels(domain, 'MISS').set(trafficReport.traffic.total - trafficReport.traffic.saved)
        this.traffic.labels(domain, 'HIT').set(trafficReport.traffic.saved)

        this.visitors.labels(domain).set(visitorsReport.visitors)

        Prometheus.register.removeSingleMetric(`${METRICS_PREFIX}high_request_ips`)
        highRequestIpReport.forEach(({ip, requestCount}) => {
          this.highRequestIps.labels(domain, ip).set(requestCount)
        })

        geoRequestReport.forEach(({code, name, traffics, requests}) => {
          this.requestsByCountry.labels(domain, code, name).set(requests)
          this.trafficByCountry.labels(domain, code, name).set(traffics)
        })

        this.responseTime.labels(domain).set(responseTimeReport.responseTime)

        Object.keys(statusCodeReport).forEach(key => {
          this.requestByStatus.labels(domain, key).set(statusCodeReport[key])
        })
      } catch (e) {
        logger.error(`Error on updating ${domain} metrics.`)
        this.updateMetricsError.labels(domain).inc()
      }
    })
  }
}

module.exports = CDNExporter
