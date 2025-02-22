import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { captureException } from '@sentry/browser';

import { isGoerli } from '@/composables/useNetwork';
import { applyNavGuards } from './nav-guards';

const ClaimPage = () => import('@/pages/claim/index.vue');
const LegacyClaimPage = () => import('@/pages/claim/legacy.vue');
const CookiesPolicyPage = () => import('@/pages/cookies-policy.vue');
const GetveNFTEPage = () => import('@/pages/get-veNFTE.vue');
const HomePage = () => import('@/pages/index.vue');
const PoolPage = () =>
  import(/* webpackPrefetch: true */ '@/pages/pool/_id.vue');
const CreatePoolPage = () => import('@/pages/pool/create.vue');
const PoolAddLiquidityPage = () => import('@/pages/pool/add-liquidity.vue');
const PoolWithdrawPage = () => import('@/pages/pool/withdraw.vue');
const PrivacyPolicyPage = () => import('@/pages/privacy-policy.vue');
const TermsOfUsePage = () => import('@/pages/terms-of-use.vue');
const RisksPage = () => import('@/pages/risks.vue');
const SwapPage = () => import('@/pages/swap.vue');

export const SwapPagePrefetchLinks = async () =>
  import('@/pages/swap.vue').toString();

const UnlockveNFTEPage = () => import('@/pages/unlock-veNFTE.vue');
const veNFTEPage = () => import('@/pages/veNFTE.vue');
const FaucetPage = () => import('@/pages/faucet.vue');
const BalancesPage = () => import('@/pages/balances.vue');

const PortfolioPage = () => import('@/pages/portfolio.vue');

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string;
    bgColors?: {
      dark: string;
      light: string;
    };
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/terms-of-use',
    name: 'terms-of-use',
    component: TermsOfUsePage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: PrivacyPolicyPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/cookies-policy',
    name: 'cookies-policy',
    component: CookiesPolicyPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/risks',
    name: 'risks',
    component: RisksPage,
    meta: { layout: 'ContentLayout' },
  },
  {
    path: '/:networkSlug/swap/:assetIn?/:assetOut?',
    name: 'swap',
    component: SwapPage,
  },
  {
    path: '/:networkSlug/trade/:assetIn?/:assetOut?',
    name: 'trade-redirect',
    redirect: to => {
      return `/${to.params.networkSlug}/swap${to.path.split('/trade')[1]}`;
    },
  },
  {
    path: '/:networkSlug/pool/create/:tx?',
    name: 'create-pool',
    component: CreatePoolPage,
    meta: { layout: 'FocussedLayout' },
  },
  {
    path: '/:networkSlug/pool/:id',
    name: 'pool',
    component: PoolPage,
  },
  {
    path: '/:networkSlug/pool/:id/add-liquidity',
    name: 'add-liquidity',
    component: PoolAddLiquidityPage,
    meta: { layout: 'JoinExitLayout' },
  },
  {
    path: '/:networkSlug/pool/:id/invest',
    name: 'invest-redirect',
    redirect: to => {
      return `/${to.params.networkSlug}/pool/${to.params.id}/add-liquidity`;
    },
  },
  {
    path: '/:networkSlug/pool/:id/withdraw',
    name: 'withdraw',
    component: PoolWithdrawPage,
    meta: { layout: 'JoinExitLayout' },
  },
  {
    path: '/:networkSlug/veNFTE',
    name: 'veNFTE',
    component: veNFTEPage,
  },
  {
    path: '/:networkSlug/get-veNFTE',
    name: 'get-veNFTE',
    component: GetveNFTEPage,
    meta: { layout: 'FocussedLayout' },
  },
  {
    path: '/:networkSlug/unlock',
    name: 'unlock',
    component: UnlockveNFTEPage,
    meta: { layout: 'FocussedLayout' },
  },
  {
    path: '/:networkSlug/claim',
    name: 'claim',
    component: ClaimPage,
  },
  {
    path: '/:networkSlug/claim/legacy',
    name: 'legacy-claim',
    component: LegacyClaimPage,
  },
  {
    path: '/:networkSlug/portfolio',
    name: 'portfolio',
    component: PortfolioPage,
  },
  {
    path: '/:networkSlug/balances',
    name: 'balances',
    component: BalancesPage,
  },
  {
    path: '/:networkSlug?',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
];

/**
 * TESTNET ONLY ROUTES
 */
if (isGoerli.value) {
  routes.push({
    path: '/:networkSlug/faucet',
    name: 'faucet',
    component: FaucetPage,
  });
}

/**
 * DEV/STAGING ONLY ROUTES
 */
// if (
//   ['development', 'staging'].includes(import.meta.env.VITE_ENV || 'development')
// ) {
//   routes.push();
// }

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      // Delaying the scroll to enforce that the route transition has finished (for example, when clicking a risk hash from the pool risks section)
      // https://router.vuejs.org/guide/advanced/scroll-behavior.html#delaying-the-scroll
      return new Promise(resolve => {
        setTimeout(() => {
          if (fromPoolToRisks(from, to)) {
            // Avoid default smooth scroll
            return resolve({
              el: to.hash,
              behavior: 'instant',
              // https://github.com/microsoft/TypeScript/issues/47441
            } as unknown as ScrollToOptions);
          }
          return resolve({
            el: to.hash,
            behavior: 'smooth',
          });
        }, 300);
      });
    }
    return { x: 0, top: 0 };
  },
});

function fromPoolToRisks(from, to) {
  return from.name === 'pool' && to.name === 'risks';
}

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    captureException(
      'Triggered automatic reload after failed to fetch dynamically imported module. ',
      {
        extra: error.message,
      }
    );
    window.location.href = to.fullPath;
  }
});

export default applyNavGuards(router);
