import process from 'process'
import InfluxDB from './InfluxDB.js'
import config from '../libs/config.js'

const {
    AUTOTRANSFER_INFLUXDB_URL,
    AUTOTRANSFER_INFLUXDB_TOKEN,
    AUTOTRANSFER_INFLUXDB_ORGANISATION,
    AUTOTRANSFER_INFLUXDB_BUCKET,
} = config

const influxDBClient = new InfluxDB({
    url: AUTOTRANSFER_INFLUXDB_URL,
    token: AUTOTRANSFER_INFLUXDB_TOKEN,
    org: AUTOTRANSFER_INFLUXDB_ORGANISATION,
    bucket: AUTOTRANSFER_INFLUXDB_BUCKET,
})

process.on('SIGINT', influxDBClient.close)

export default influxDBClient
