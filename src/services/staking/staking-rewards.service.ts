import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { mapValues } from 'lodash';

import { bnum } from '@/lib/utils';
import { configService } from '@/services/config/config.service';
import BalancerContractsService from '../balancer/contracts/balancer-contracts.service';
import { LiquidityGauge } from '../balancer/contracts/contracts/liquidity-gauge';
import { veNFTEProxy } from '../balancer/contracts/contracts/veNFTE-proxy';
import { GaugeShare } from '@/composables/queries/useUserGaugeSharesQuery';
import { UserBoosts } from '@/composables/queries/useUserBoostsQuery';

export class StakingRewardsService {
  async getWorkingSupplyForGauges(gaugeAddresses: string[]) {
    // start with a fresh multicaller
    const multicaller = LiquidityGauge.getMulticaller();

    for (const gaugeAddress of gaugeAddresses) {
      multicaller.call(
        getAddress(gaugeAddress),
        getAddress(gaugeAddress),
        'working_supply'
      );
    }
    const result = await multicaller.execute();
    const supplies = mapValues(result, weight => formatUnits(weight, 18));
    return supplies;
  }

  /**
   * getBoostDeps
   *
   * Fetches data required to calculate boosts
   * 1. veNFTE total supply.
   * 2. Given user's veNFTE balance.
   *
   * @param {string} userAddress - Account to fetch data for.
   * @param {string[]} gaugeAddresses - Gauge's to fetch data for.
   * @returns Set of data described in description above.
   */
  async getBoostDeps(userAddress: string) {
    const veNFTEProxy = new veNFTEProxy(
      configService.network.addresses.veDelegationProxy
    );

    const getveNFTEInfo = await new BalancerContractsService().veNFTE.getLockInfo(
      userAddress
    );
    // need to use veNFTE balance from the proxy as the balance from the proxy takes
    // into account the amount of delegated veNFTE as well
    const getveNFTEBalance = veNFTEProxy.getAdjustedBalance(userAddress);

    const [{ totalSupply: veNFTETotalSupply }, userveNFTEBalance] =
      await Promise.all([getveNFTEInfo, getveNFTEBalance]);

    return {
      veNFTETotalSupply,
      userveNFTEBalance,
    };
  }

  /**
   * calcUserBoost
   *
   * Pure function for calculating a user's boost for a given gauge.
   * See: https://www.notion.so/veNFTE-Boost-7a2ae8b6c8ff470f9dbe5b6bab4ff989#3037cbd3f619457681d63627db92541a
   *
   * @param {string} userGaugeBalance - User's balance in gauge.
   * @param {string} gaugeTotalSupply - The gauge's total supply.
   * @param {string} userveNFTEBalance - User's veNFTE balance.
   * @param {string} veNFTETotalSupply - veNFTE total supply.
   * @returns User's boost value for given gauge.
   */
  calcUserBoost({
    userGaugeBalance,
    gaugeTotalSupply,
    userveNFTEBalance,
    veNFTETotalSupply,
  }: {
    userGaugeBalance: string;
    gaugeTotalSupply: string;
    userveNFTEBalance: string;
    veNFTETotalSupply: string;
  }): string {
    const _userGaugeBalance = bnum(userGaugeBalance);
    const _gaugeTotalSupply = bnum(gaugeTotalSupply);
    const _userveNFTEBalance = bnum(userveNFTEBalance);
    const _veNFTETotalSupply = bnum(veNFTETotalSupply);
    const boost = bnum(1).plus(
      bnum(1.5)
        .times(_userveNFTEBalance)
        .div(_veNFTETotalSupply)
        .times(_gaugeTotalSupply)
        .div(_userGaugeBalance)
    );
    const minBoost = bnum(2.5).lt(boost) ? 2.5 : boost;

    return minBoost.toString();
  }

  /**
   * getUserBoosts
   *
   * Fetches user boost values for given set of gauges. Returns map of poolId ->
   * boost.
   *
   * @param {string} userAddress - Account to fetch boosts for.
   * @param {GaugeShare[]} gaugeShares - Gauges to calculate boosts for.
   * @returns Map of poolId -> boost
   */
  async getUserBoosts({
    userAddress,
    gaugeShares,
  }: {
    userAddress: string;
    gaugeShares: GaugeShare[];
  }): Promise<UserBoosts> {
    const { veNFTETotalSupply, userveNFTEBalance } = await this.getBoostDeps(
      userAddress
    );

    const boosts = gaugeShares.map(gaugeShare => {
      const boost = this.calcUserBoost({
        userGaugeBalance: gaugeShare.balance,
        gaugeTotalSupply: gaugeShare.gauge.totalSupply,
        userveNFTEBalance,
        veNFTETotalSupply,
      });

      return [gaugeShare.gauge.poolId, boost];
    });

    return Object.fromEntries(boosts);
  }
}

export const stakingRewardsService = new StakingRewardsService();
