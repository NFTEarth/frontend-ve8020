import NProgress from 'nprogress';
import { useRouter } from 'vue-router';
import { networkId } from './useNetwork';
import { useSidebar } from './useSidebar';
import useveNFTE from './useveNFTE';

// Progress bar config
NProgress.configure({ showSpinner: false });
let delayedStartProgressBar;

/**
 * Navigation guards that require Vue app context.
 */
export default function useNavigationGuards() {
  const router = useRouter();
  const { setShowRedirectModal, isveNFTESupported } = useveNFTE();
  const { setSidebarOpen } = useSidebar();

  router.beforeEach((to, from, next) => {
    localStorage.setItem('networkId', networkId.value.toString());

    if (to.name == 'veNFTE') {
      if (isveNFTESupported.value) next();
      else {
        setSidebarOpen(false);
        setShowRedirectModal(true);
        return false;
      }
    } else {
      next();
    }
  });

  router.beforeEach(() => {
    // Delay start of progress bar so only the users with slow connections can see it
    delayedStartProgressBar = setTimeout(() => {
      NProgress.start();
    }, 1000);
  });

  router.afterEach(() => {
    // Clear progress bar timeout, so it doesn't start after page load
    clearTimeout(delayedStartProgressBar);

    // Complete the animation of the route progress bar.
    NProgress.done();
  });

  router.onError(() => {
    NProgress.done();
  });
}
