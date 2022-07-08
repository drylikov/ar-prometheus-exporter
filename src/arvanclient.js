const axios = require('axios')
const { BASE_URL, METRICS_PERIOD } = require('./config')

class ArvanClient {
  constructor(apiKey) {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        authorization: apiKey,
      }
    });
  }

  async getTrafficReport(domain) {
    const req = await this.client.get(`/domains/${domain}/reports/traffics?period=${METRICS_PERIOD}`)
    const latestTrafficReport = req.data.data.charts.traffics.series
    const totalTraffic = latestTrafficReport.find(obj => obj.name === 'reports.traffics.total').data
    const savedTraffic = latestTrafficReport.find(obj => obj.name === 'reports.traffics.saved').data

    const latestRequestsReport = req.data.data.charts.requests.series
    const totalRequests = latestRequestsReport.find(obj => obj.name === 'reports.requests.total').data
    const savedRequests = latestRequestsReport.find(obj => obj.name === 'reports.requests.saved').data

    return {
      traffic: {
        total: totalTraffic[totalTraffic.length - 1],
        saved: savedTraffic[savedTraffic.length - 1],
      },
      requests: {
        total: totalRequests[totalRequests.length - 1],
        saved: savedRequests[savedRequests.length - 1],
      }
    }
  }

  async getUniqueVisitorsReport(domain) {
    const req = await this.client.get(`/domains/${domain}/reports/visitors?period=${METRICS_PERIOD}`)
    const latestVisitorsReport = req.data.data.charts.visitors.series
    const visitors = latestVisitorsReport.find(obj => obj.name === 'reports.visitor.visitors').data

    return {
      visitors: visitors[visitors.length - 1]
    }
  }

  async getHighRequestIps(domain) {
    const req = await this.client.get(`/domains/${domain}/reports/high-request-ips?period=${METRICS_PERIOD}`)
    return req.data.data.map(info => ({ip: info.ip, requestCount: info.request_count}))
  }

  async getGeoTrafficReport(domain) {
    const req = await this.client.get(`/domains/${domain}/reports/traffics/map?period=${METRICS_PERIOD}`)
    return req.data.data.lists.map(info => ({
      code: info.country,
      name: info.name,
      traffics: info.traffics,
      requests: info.requests
    }))
  }

  async getResponseTimeReport(domain) {
    const req = await this.client.get(`/domains/${domain}/reports/response-time?period=${METRICS_PERIOD}`)

    const latestResponseTimeReport = req.data.data.charts.ir.series
    const responseTime = latestResponseTimeReport.find(obj => obj.name === 'reports.response_time.Server').data

    return {
      responseTime: responseTime[responseTime.length - 1]
    }
  }

  async getStatusCodeReport(domain) {
    const req = await this.client.get(`/domains/${domain}/reports/status?period=${METRICS_PERIOD}`)

    const statusCodes = req.data.data.statistics.status_codes
    return {
      '1xx': statusCodes['1xx_sum'] || 0,
      '2xx': statusCodes['2xx_sum'] || 0,
      '3xx': statusCodes['3xx_sum'] || 0,
      '4xx': statusCodes['4xx_sum'] || 0,
      '5xx': statusCodes['5xx_sum'] || 0,
    }
  }
}

module.exports = ArvanClient
