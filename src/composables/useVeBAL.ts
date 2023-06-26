import { differenceInSeconds, formatDistanceToNow, sub } from 'date-fns';
import { computed, ref } from 'vue';

import { POOLS } from '@/constants/pools';
import { bnum } from '@/lib/utils';

import useConfig from './useConfig';
import { getPreviousThursday, oneYearInSecs, toJsTimestamp } from './useTime';
import { useTokens } from '@/providers/tokens.provider';
import { WEIGHT_VOTE_DELAY } from '@/constants/gauge-controller';
import { configService } from '@/services/config/config.service';

/**
 * STATE
 */
const showRedirectModal = ref(false);

/**
 * COMPUTED
 */
export const isveNFTESupported = computed<boolean>(
  () => configService.network.addresses.veNFTE !== ''
);

/**
 * METHODS
 */
function setShowRedirectModal(newVal: boolean) {
  showRedirectModal.value = newVal;
}

/**
 * @summary Calculate expected veNFTE given BPT being locked and lock time in seconds.
 * @param {string} bpt - BPT amount being locked up
 * @param {str} lockDateStr - Date in string format used to create Date of lock
 */
export function expectedveNFTE(bpt: string, lockDateStr: string): string {
  const now = new Date();
  const lockDate = new Date(lockDateStr);
  const previousThursdayBeforeLockDate = getPreviousThursday(lockDate);
  const lockTime = differenceInSeconds(previousThursdayBeforeLockDate, now);

  return bnum(bpt).times(lockTime).div(oneYearInSecs).toString();
}

/**
 * @summary Get date object of previous epoch given number of weeks to go back.
 * @param {number} weeksToGoBack - Number of weeks to go back for epoch, if 0
 * gets the immediate epoch in the past. If 1, gets the week before that and so on.
 */
export function getPreviousEpoch(weeksToGoBack = 0): Date {
  const now = new Date();
  const todayAtMidnightUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  let daysSinceThursday = now.getDay() - 4;
  if (daysSinceThursday < 0) daysSinceThursday += 7;

  daysSinceThursday = daysSinceThursday + weeksToGoBack * 7;

  return sub(todayAtMidnightUTC, {
    days: daysSinceThursday,
  });
}

export function isVotingTimeLocked(lastVoteTime: number): boolean {
  const lastUserVoteTime = toJsTimestamp(lastVoteTime);
  return Date.now() < lastUserVoteTime + WEIGHT_VOTE_DELAY;
}

export function remainingVoteLockTime(lastVoteTime: number): string {
  const lastUserVoteTime = toJsTimestamp(lastVoteTime);
  return formatDistanceToNow(lastUserVoteTime + WEIGHT_VOTE_DELAY);
}

export default function useveNFTE() {
  /**
   * COMPOSABLES
   */
  const { balanceFor, getToken } = useTokens();
  const { networkConfig } = useConfig();

  /**
   * COMPUTED
   */
  const veNFTETokenInfo = computed(() =>
    networkConfig.addresses.veNFTE
      ? getToken(networkConfig.addresses.veNFTE)
      : null
  );

  const veNFTEBalance = computed(() =>
    balanceFor(networkConfig.addresses.veNFTE)
  );

  const lockablePoolId = computed(() => POOLS.IdsMap?.veNFTE);

  return {
    // computed
    isveNFTESupported,
    veNFTETokenInfo,
    veNFTEBalance,
    lockablePoolId,
    showRedirectModal,
    // methods
    setShowRedirectModal,
  };
}
