import { HttpInterceptorFn } from '@angular/common/http';
import { retry, timer, throwError } from 'rxjs';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const metadata = {
    currentUserId: 2,
    currentProjectId: -1,
    activatedRoleId: 1,
    activatedRoleTitle: 'Self',
    applicationId: 1,
    clientId: -1,
    lang: 'en',
    projectTitle: 'vhs',
    projectType: 'Project',
    username: 'admin.hive',
    versionId: 0,
  };

  // Strict skip for auth-related calls
  if (req.url?.includes('/login') || req.url?.includes('/verifyUser')) {
    return next(req);
  }

  if (token && req.method === 'POST') {
    const currentBody = (req.body as any) || {};

    const finalBody = {
      ...metadata,
      ...currentBody,
    };
    if (req.url.includes('findAlllov')) {
      finalBody.pagination = {
        pageNo: 0,
        itemPerPage: 10,
        totalCount: 0,
        pagingOption: [10, 50, 100],
      };
    }

    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      body: finalBody,
    });

    return next(authReq).pipe(
      retry({
        count: 1,
        delay: (error) => {
          // Retry on 500 or 401 to wait for session sync
          if (error.status === 500 || error.status === 401) {
            return timer(2000);
          }
          return throwError(() => error);
        },
      }),
    );
  }

  const finalReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(finalReq);
};
