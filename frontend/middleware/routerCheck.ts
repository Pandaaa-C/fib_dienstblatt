import { RouteLocation } from 'vue-router';

export default defineNuxtRouteMiddleware(async (to: RouteLocation, from: RouteLocation) => {
    const openRoutes: string[] = ['/auth/login', '/auth/logout'];
    const cookies = useCookie('login_token');

    if (!openRoutes.includes(to.path) && (cookies.value == '' || cookies.value == undefined)) {
        return { path: '/auth/login' };
    }
});
