import { NavigationGuard } from 'vue-router';
import { getInstance } from './index';

const authGuard: NavigationGuard = (to, from, next) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authService: any = getInstance();

  const fn = () => {
    // If the user is authenticated, continue with the route
    if (authService.isAuthenticated) {
      next();
      return;
    }

    // Otherwise, log in
    authService.loginWithRedirect({ appState: { targetUrl: to.fullPath } });
  };

  // If loading has already finished, check our auth state using `fn()`
  if (!authService.loading) {
    fn();
    return;
  }

  // Watch for the loading property to change before we check isAuthenticated
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  authService.$watch('loading', (loading: any) => {
    if (loading === false) {
      fn();
    }
  });
};

export default authGuard;
