# ar-prometheus-exporter
ArvanCloud CDN Analytics Prometheus Exporter

A very simple Prometheus exporter that exposes metrics from ArvanCloud colocations API as described in the [API documentation](https://www.arvancloud.com/docs/api/cdn/4.0).

# Brief
A Prometheus exporter that exposes metrics from ArvanCloud's API as described in the API documentation.

### Try it
Running the container:
```
git clone git@github.com:arvancloud/ar-prometheus-exporter.git && cd ar-prometheus-exporter
docker build -t ar-prometheus-exporter .
docker run -d \
 -p 9097:9097 \
 -e DOMAINS=example.com,example.ir \
 -e API_KEY=TOKEN_HERE \
 ar-prometheus-exporter
```

### Metrics
The exporter exposes the following metrics, all returned per PoP:

| Name                                 | Description                                               |  Type |
|:-------------------------------------|:----------------------------------------------------------|:-----:|
| `arvancloud_cdn_update_metrics_error`   | number of exporter errors | counter |
| `arvancloud_cdn_requests`     | number of requests  | gauge |
| `arvancloud_cdn_traffic` | traffic served by ArvanCloud                       | gauge |
| `arvancloud_cdn_visitors`        | number of unique visitors | gauge |
| `arvancloud_cdn_high_request_ips`        | high request ips                                     | gauge |
| `arvancloud_cdn_requests_by_country`    | number of request by country                                 | gauge |
| `arvancloud_cdn_traffic_by_country`      | traffic by country                      | gauge |
| `arvancloud_cdn_response_time`            | response time                     | gauge |
| `arvancloud_cdn_requests_by_status`               | number of request by HTTP status code                   | gauge |


### Config

| Name                                 | Description                                               |  Type | Default
|:-------------------------------------|:----------------------------------------------------------|:-----:|:--------:|
| `MODE` | metrics collector mode | enum(ACTIVE, PASSIVE) | PASSIVE
| `PORT` | listening port  | number | 9097
| `API_KEY` | your Arvan API-Key | string | -
| `DOMAINS` | list of domain wants to scrape metrics | string or comma separate list | -
| `UPDATE_INTERVAL` | update metrics interval (only valid in passive mode) | number(milliseconds) | 30000
| `BASE_URL` | Arvan base URL | string | https://napi.arvancloud.com/cdn/4.0
| `METRICS_PERIOD` | Arvan report period | enum(1h, 3h, 6h, 12h, 24h, 7d, 30d) | 3h
| `METRICS_PREFIX` | exported metrics prefix | string | `arvancloud_cdn_`

### 👨🏻‍💻 Contributors:
- SadeghHayeri [![https://github.com/sadeghhayeri](https://img.shields.io/github/followers/sadeghhayeri?color=red&label=Follow&logo=github&style=flat-square)](https://github.com/sadeghhayeri)
- Yazdan [![https://github.com/yzdann](https://img.shields.io/github/followers/yzdann?color=red&label=Follow&logo=github&style=flat-square)](https://github.com/yzdann)