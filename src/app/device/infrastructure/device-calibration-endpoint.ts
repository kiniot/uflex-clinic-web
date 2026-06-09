import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {CalibrationCommand} from '../domain/model/calibration.command';
import {CalibrationActionRequest} from './device.request';
import {DeviceResponse} from './device.response';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {Device} from '../domain/model/device.entity';
import {DeviceAssembler} from './device.assembler';

export class DeviceCalibrationApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: DeviceAssembler = new DeviceAssembler(),
  ) {
    super();
  }

  execute(command: CalibrationCommand): Observable<Device> {
    const endpointUrl = buildApiUrl(
      environment.apiBaseUrl,
      `${environment.platformProviderDevicesEndpointPath}/${command.serialNumber}/calibration`,
    );

    const request: CalibrationActionRequest = {
      action: command.action,
    };

    return this.http.patch<DeviceResponse>(endpointUrl, request).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to calibrate device')),
    );
  }
}