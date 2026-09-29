import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    //Recupero del token
    const token = localStorage.getItem('token');

    if (token) {
        const cloneReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        return next(cloneReq);
    }

    return next(req);
}