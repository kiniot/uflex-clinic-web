import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {UpdateDeviceStatusCommand} from '../domain/model/update-device-status.command';
import {UpdateDeviceStatusRequest} from './device.request';
import {DeviceResponse} from './device.response';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {Device} from '../domain/model/device.entity';
import {DeviceAssembler} from './device.assembler';

export class DeviceStatusApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: DeviceAssembler = new DeviceAssembler(),
  ) {
    super();
  }

  updateStatus(command: UpdateDeviceStatusCommand): Observable<Device> {
    const endpointUrl = buildApiUrl(
      environment.apiBaseUrl,
      `${environment.platformProviderDevicesEndpointPath}/${command.serialNumber}/status`,
    );

    const request: UpdateDeviceStatusRequest = {
      status: command.status,
    };

    return this.http.patch<DeviceResponse>(endpointUrl, request).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to update device status')),
    );
  }
}