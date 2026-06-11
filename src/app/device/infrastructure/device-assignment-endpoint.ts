import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError} from 'rxjs';
import {AssignDeviceCommand} from '../domain/model/assign-device.command';
import {AssignDeviceToPatientRequest} from './device.request';
import {DeviceResponse} from './device.response';
import {buildApiUrl} from '../../shared/infrastructure/api-url';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {Device} from '../domain/model/device.entity';
import {DeviceAssembler} from './device.assembler';

export class DeviceAssignmentApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: DeviceAssembler = new DeviceAssembler(),
  ) {
    super();
  }

  assign(command: AssignDeviceCommand): Observable<Device> {
    const endpointUrl = buildApiUrl(
      environment.apiBaseUrl,
      `${environment.platformProviderDevicesEndpointPath}/${command.serialNumber}/patient-assignments`,
    );

    const request: AssignDeviceToPatientRequest = {
      patientId: command.patientId,
    };

    return this.http.post<DeviceResponse>(endpointUrl, request).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to assign device')),
    );
  }

  unassign(serialNumber: string): Observable<void> {
    const endpointUrl = buildApiUrl(
      environment.apiBaseUrl,
      `${environment.platformProviderDevicesEndpointPath}/${serialNumber}/patient-assignments`,
    );

    return this.http.delete<void>(endpointUrl).pipe(
      catchError(this.handleError('Failed to unassign device')),
    );
  }
}