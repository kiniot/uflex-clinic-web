import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildApiUrl } from '../../shared/infrastructure/api-url';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { CurrentSubscriptionResponse } from './subscription-current-response';

const currentSubscriptionApiEndpointUrl = buildApiUrl(
  environment.apiBaseUrl,
  environment.platformProviderCurrentSubscriptionEndpointPath,
);

export class CurrentSubscriptionApiEndpoint extends ErrorHandlingEnabledBaseType {
  constructor(private http: HttpClient) {
    super();
  }

  getCurrent(): Observable<CurrentSubscriptionResponse | null> {
    return this.http.get<CurrentSubscriptionResponse>(currentSubscriptionApiEndpointUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) return of(null);
        return this.handleError('Failed to load current subscription')(error);
      }),
    );
  }
}
