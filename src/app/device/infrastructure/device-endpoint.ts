import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { Device } from '../domain/model/device.entity';
import { DeviceResponse } from './device.response';
import { DeviceAssembler } from './device.assembler';

const deviceApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderDevicesEndpointPath,
);

export class DeviceApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(
    private http: HttpClient,
    private assembler: DeviceAssembler = new DeviceAssembler(),
  ) {
    super();
  }

  getAll(): Observable<Device[]> {
    return this.http.get<DeviceResponse[]>(deviceApiEndpointUrl).pipe(
      map((responses: DeviceResponse[]) =>
        responses.map((r) => this.assembler.toEntityFromResource(r)),
      ),
      catchError(this.handleError('Failed to fetch devices')),
    );
  }

  getById(deviceId: string): Observable<Device> {
    const url = `${deviceApiEndpointUrl}/${deviceId}`;
    return this.http.get<DeviceResponse>(url).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to fetch device')),
    );
  }

  getBySerialNumber(serialNumber: string): Observable<Device> {
    const url = `${deviceApiEndpointUrl}/by-serial-number/${encodeURIComponent(serialNumber)}`;
    return this.http.get<DeviceResponse>(url).pipe(
      map((response: DeviceResponse) => this.assembler.toEntityFromResource(response)),
      catchError(this.handleError('Failed to fetch device by serial number')),
    );
  }

  delete(deviceId: string): Observable<void> {
    const url = `${deviceApiEndpointUrl}/${deviceId}`;
    return this.http
      .delete<void>(url)
      .pipe(catchError(this.handleError('Failed to delete device')));
  }
}
