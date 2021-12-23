import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'geocoder',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        query: {
          format: '{format=json}',
          benchmark: 'Public_AR_Current',
          address: '{address}',
          key: process.env.API_KEY,
          sensor: '{sensor=false}',
        },
        responsePath: '$.result.addressMatches[*].coordinates',
      },
      functions: {
        geocode: ['address'],
      },
    },
  ],
};

// Observe applicaton's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class GeocoderDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'geocoder';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.geocoder', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
