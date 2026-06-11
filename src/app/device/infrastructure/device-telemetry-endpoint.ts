import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {UpdateTelemetryCommand} from '../domain/model/update-telemetry.command';
import {UpdateTelemetryRequest} from './device.request';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';

export class DeviceTelemetryApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  update(command: UpdateTelemetryCommand): Observable<void> {
    const endpointUrl = buildApiUrl(
      environment.apiBaseUrl,
      `${environment.platformProviderDevicesEndpointPath}/${command.serialNumber}/telemetry`,
    );

    const request: UpdateTelemetryRequest = {
      batteryLevel: command.batteryLevel,
    };

    return this.http.patch<void>(endpointUrl, request).pipe(
      catchError(this.handleError('Failed to update telemetry')),
    );
  }
}