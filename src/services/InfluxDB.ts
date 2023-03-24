import { InfluxDB, Point, type WriteApi } from '@influxdata/influxdb-client';

class InfluxDBClass {
  #client: InfluxDB;
  #writeApi: WriteApi;

  constructor({
    url,
    token,
    org,
    bucket,
  }: {
    url: string;
    token: string;
    org: string;
    bucket: string;
  }) {
    this.#client = new InfluxDB({ url, token });
    this.#writeApi = this.#client.getWriteApi(org, bucket);
  }

  async pushTransferData({
    tag,
    localIp,
    publicIp,
    amount,
  }: {
    tag: string;
    localIp: string;
    publicIp: string;
    amount: number;
  }): Promise<void> {
    const point = new Point('BTTC')
      .tag('tag', tag)
      .tag('local_ip', localIp)
      .tag('public_ip', publicIp)
      .floatField('amount', amount)
      .timestamp(new Date());

    this.#writeApi.writePoint(point);
    await this.#writeApi.flush();
  }
}

export default InfluxDBClass;
