import { RouteLocation } from 'vue-router';

export default defineNuxtRouteMiddleware(async (to: RouteLocation, from: RouteLocation) => {
    const cookies = useCookie('login_token');

    if (cookies.value == undefined || cookies.value == '') return { path: '/auth/login' };

    return { path: '/dashboard' };
});
