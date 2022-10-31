import { InfluxDB, Point } from '@influxdata/influxdb-client'

class InfluxDBClass {
    #client
    #writeApi

    constructor({ url, token, org, bucket }) {
        this.#client = new InfluxDB({ url, token })
        this.#writeApi = this.#client.getWriteApi(org, bucket)
    }

    async pushTransferData({ tag, localIp, publicIp, amount }) {
        const point = new Point('BTT')
            .tag('tag', tag)
            .tag('local_ip', localIp)
            .tag('public_ip', publicIp)
            .floatField('amount', amount)
            .timestamp(new Date())

        this.#writeApi.writePoint(point)
        await this.#writeApi.flush()
    }
}

export default InfluxDBClass
