import { HttpInterceptorFn } from '@angular/common/http';

export const interceptorInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    
    const metadata = {
        currentUserId: 2,
        currentProjectId: -1,
        activatedRoleId: 1,
        activatedRoleTitle: "Self",
        applicationId: 1,
        clientId: -1,
        lang: "en",
        projectTitle: "vhs",
        projectType: "Project",
        username: "admin.hive",
        versionId: 0
    };

    if (req.url?.includes('/login')) {
        return next(req);
    }

    if (token && req.method === 'POST') {
        const currentBody = req.body as any || {};

        let newBody: any = {
            ...metadata,
            ...currentBody
        };
        if (req.url.includes('findAlllov')) {
            newBody.pagination = {
                pageNo: 0,
                itemsPerPage: 10,
                totalCount: 0,
                pagingOption: [10, 50, 100]
            };
        }

        const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            body: newBody
        });
        
        return next(authReq);
    }
    const finalReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
    return next(finalReq);
};