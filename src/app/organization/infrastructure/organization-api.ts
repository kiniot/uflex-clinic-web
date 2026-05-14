import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { CreateClinicCommand } from '../domain/model/create-clinic.command';
import { CreateClinicAssembler } from './create-clinic-assembler';
import { CreateClinicApiEndpoint } from './create-clinic-endpoint';
import { ClinicResource } from './create-clinic-response';

/**
 * API service for Organization bounded-context operations.
 */
@Injectable({ providedIn: 'root' })
export class OrganizationApi extends BaseApi {
  private readonly createClinicEndpoint: CreateClinicApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.createClinicEndpoint = new CreateClinicApiEndpoint(http, new CreateClinicAssembler());
  }

  createClinic(command: CreateClinicCommand): Observable<ClinicResource> {
    return this.createClinicEndpoint.createClinic(command);
  }
}
