import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

//Controllo se l'utente è autenticato (ha un token)
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const token = sessionStorage.getItem('token');

    if (token) return true;

    router.navigate(['/login']);
    return false;
};

//Guard basata sui ruoli: simile al checkRole del backend
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
    return (route, state) => {
        const router = inject(Router);
        const userJson = sessionStorage.getItem('user');

        if (!userJson) {
            router.navigate(['/login']);
            return false;
        }

        const user = JSON.parse(userJson);

        //Controllo se il ruolo dell'utente rientra tra quelli ammessi
        if (user && allowedRoles.includes(user.role))
            return true;

        //Se non ha i permessi si reindirizza alla home
        router.navigate(['/home']);
        return false;
    };
};