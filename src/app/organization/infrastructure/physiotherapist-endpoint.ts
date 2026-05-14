import {environment} from '../../../environments/environment';
import {ErrorHandlingEnabledBaseType} from '../../shared/infrastructure/error-handling-enabled-base-type';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {PhysiotherapistAssembler} from './physiotherapist-assembler';
import {PhysiotherapistRequest} from './physiotherapist-request';
import {PhysiotherapistResponse, PhysiotherapistResource} from './physiotherapist-response';
import {RegisterPhysiotherapistCommand} from '../domain/model/register-physiotherapist.command';
import {TeamMember} from '../domain/model/team-member.entity';

const physiotherapistApiEndpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderPhysiotherapistsEndpointPath}`;

export class PhysiotherapistApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient, private assembler: PhysiotherapistAssembler) {
    super();
  }

  getAll(): Observable<TeamMember[]> {
    return this.http.get<PhysiotherapistResponse[]>(physiotherapistApiEndpointUrl).pipe(
      map(response => response.map(r => this.assembler.toEntityFromResource(r as unknown as PhysiotherapistResource))),
      catchError(this.handleError('Failed to fetch physiotherapists'))
    );
  }

  getById(id: string): Observable<TeamMember> {
    return this.http.get<PhysiotherapistResponse>(`${physiotherapistApiEndpointUrl}/${id}`).pipe(
      map(response => this.assembler.toEntityFromResource(response as unknown as PhysiotherapistResource)),
      catchError(this.handleError('Failed to fetch physiotherapist'))
    );
  }

  create(command: RegisterPhysiotherapistCommand): Observable<TeamMember> {
    const request = this.assembler.toRequestFromCommand(command);
    return this.http.post<PhysiotherapistResponse>(physiotherapistApiEndpointUrl, request).pipe(
      map(response => this.assembler.toEntityFromResource(response as unknown as PhysiotherapistResource)),
      catchError(this.handleError('Failed to create physiotherapist'))
    );
  }
}