import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {DeviceResponse} from './device.response';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {Device} from '../domain/model/device.entity';
import {DeviceAssembler} from './device.assembler';

const myAssignedDeviceEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderMyAssignedDeviceEndpointPath,
);

export class MyAssignedDeviceApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: DeviceAssembler = new DeviceAssembler(),
  ) {
    super();
  }

  getMyAssigned(): Observable<Device> {
    return this.http.get<DeviceResponse>(myAssignedDeviceEndpointUrl).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to get my assigned device')),
    );
  }
}