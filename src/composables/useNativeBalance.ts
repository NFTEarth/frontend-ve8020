import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';
import { computed } from 'vue';
import { useTokens } from '@/providers/tokens.provider';

export default function useNativeNFTEance() {
  const { hasBalance, nativeAsset, balanceFor } = useTokens();
  const nativeCurrency = configService.network.nativeAsset.symbol;

  const { appNetworkConfig, isWalletReady } = useWeb3();

  const nativeNFTEance = computed(() => {
    if (!isWalletReady.value) return '-';
    return Number(balanceFor(appNetworkConfig.nativeAsset.address)).toFixed(4);
  });

  const hasNativeNFTEance = computed(() => hasBalance(nativeAsset.address));

  return {
    hasNativeNFTEance,
    nativeNFTEance,
    nativeCurrency,
  };
}
