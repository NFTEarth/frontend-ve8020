import { computed, reactive } from 'vue';
import { useQuery, UseQueryOptions } from '@tanstack/vue-query';

import { balancerContractsService } from '@/services/balancer/contracts/balancer-contracts.service';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';
import useWeb3 from '@/services/web3/useWeb3';

import useNetwork from '../useNetwork';
import { isveNFTESupported } from '../useveNFTE';

/**
 * TYPES
 */
type QueryResponse = veNFTELockInfo;
type QueryOptions = UseQueryOptions<QueryResponse>;

export default function useveNFTEQuery(options: QueryOptions = {}) {
  /**
   * COMPOSABLES
   */
  const { account, isWalletReady } = useWeb3();
  const { networkId } = useNetwork();
  /**
   * COMPUTED
   */
  const enabled = computed(() => isWalletReady.value && isveNFTESupported.value);

  const queryFn = () =>
    balancerContractsService.veNFTE.getLockInfo(account.value);

  const queryOptions = reactive({
    enabled,
    ...options,
  });

  return useQuery<QueryResponse>(
    reactive(['tokens', 'veNFTE', { networkId, account }]),
    queryFn,
    queryOptions as QueryOptions
  );
}
