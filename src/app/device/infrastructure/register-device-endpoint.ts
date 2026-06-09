import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {RegisterDeviceCommand} from '../domain/model/register-device.command';
import {RegisterDeviceRequest} from './device.request';
import {DeviceResponse} from './device.response';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {Device} from '../domain/model/device.entity';
import {DeviceAssembler} from './device.assembler';

const registerDeviceApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderDevicesEndpointPath,
);

export class RegisterDeviceApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: DeviceAssembler = new DeviceAssembler(),
  ) {
    super();
  }

  execute(command: RegisterDeviceCommand): Observable<Device> {
    const request: RegisterDeviceRequest = {
      serialNumber: command.serialNumber,
      macAddress: command.macAddress,
      firmwareVersion: command.firmwareVersion,
      model: command.model,
    };

    return this.http.post<DeviceResponse>(registerDeviceApiEndpointUrl, request).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to register device')),
    );
  }
}