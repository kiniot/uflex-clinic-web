import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError} from 'rxjs';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {FleetMetrics} from '../domain/model/fleet-metrics';

const fleetMetricsEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderDeviceMetricsEndpointPath,
);

export class FleetMetricsApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  getMetrics(): Observable<FleetMetrics> {
    return this.http.get<FleetMetrics>(fleetMetricsEndpointUrl).pipe(
      catchError(this.handleError('Failed to fetch fleet metrics')),
    );
  }
}
