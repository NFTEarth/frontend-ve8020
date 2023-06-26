import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { WalletProvider } from '@/dependencies/wallets/Web3Provider';
import { formatUnits } from '@ethersproject/units';
import { parseUnits } from '@ethersproject/units';

import { toJsTimestamp, toUtcTime } from '@/composables/useTime';
import veNFTEAbi from '@/lib/abi/veNFTEAbi.json';

import Service from '../balancer-contracts.service';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { ContractInterface } from 'ethers';
import { getOldMulticaller } from '@/dependencies/OldMulticaller';

export type veNFTELockInfo = {
  lockedEndDate: number;
  lockedAmount: string;
  totalSupply: string;
  epoch: string;
  hasExistingLock: boolean;
  isExpired: boolean;
};

export type veNFTELockInfoResult = {
  locked: BigNumber[];
  epoch: BigNumber;
  totalSupply: BigNumber;
};

export default class veNFTE {
  service: Service;

  constructor(service: Service) {
    this.service = service;
  }

  private parseDate(date: string) {
    return (toUtcTime(new Date(date)) / 1000).toString();
  }

  public async getLockInfo(account: string): Promise<veNFTELockInfo> {
    const Multicaller = getOldMulticaller();
    const veNFTEMulticaller = new Multicaller(
      this.service.config.key,
      this.service.provider,
      veNFTEAbi
    );

    veNFTEMulticaller.call('locked', this.address, 'locked', [account]);
    veNFTEMulticaller.call('epoch', this.address, 'epoch');
    veNFTEMulticaller.call('totalSupply', this.address, 'totalSupply()');

    const result = await veNFTEMulticaller.execute<veNFTELockInfoResult>();

    return this.formatLockInfo(result);
  }

  public formatLockInfo(lockInfo: veNFTELockInfoResult) {
    const [lockedAmount, lockedEndDate] = lockInfo.locked;

    const hasExistingLock = lockedAmount.gt(0);
    const lockedEndDateNormalised = toJsTimestamp(lockedEndDate.toNumber());
    const isExpired = hasExistingLock && Date.now() > lockedEndDateNormalised;

    return {
      lockedEndDate: lockedEndDateNormalised,
      lockedAmount: formatUnits(lockedAmount, 18),
      totalSupply: formatUnits(lockInfo.totalSupply, 18),
      epoch: lockInfo.epoch.toString(),
      hasExistingLock,
      isExpired,
    };
  }

  public async createLock(
    userProvider: WalletProvider,
    lockAmount: string,
    lockEndDate: string
  ): Promise<TransactionResponse> {
    const txBuilder = new TransactionBuilder(userProvider.getSigner());
    return await txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: veNFTEAbi as ContractInterface,
      action: 'create_lock',
      params: [parseUnits(lockAmount, 18), this.parseDate(lockEndDate)],
    });
  }

  public async increaseLock(
    userProvider: WalletProvider,
    lockAmount: string
  ): Promise<TransactionResponse> {
    const txBuilder = new TransactionBuilder(userProvider.getSigner());
    return await txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: veNFTEAbi as ContractInterface,
      action: 'increase_amount',
      params: [parseUnits(lockAmount, 18)],
    });
  }

  public async extendLock(
    userProvider: WalletProvider,
    lockEndDate: string
  ): Promise<TransactionResponse> {
    const txBuilder = new TransactionBuilder(userProvider.getSigner());
    return await txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: veNFTEAbi as ContractInterface,
      action: 'increase_unlock_time',
      params: [this.parseDate(lockEndDate)],
    });
  }

  public async unlock(
    userProvider: WalletProvider
  ): Promise<TransactionResponse> {
    const txBuilder = new TransactionBuilder(userProvider.getSigner());
    return await txBuilder.contract.sendTransaction({
      contractAddress: this.address,
      abi: veNFTEAbi as ContractInterface,
      action: 'withdraw',
    });
  }

  public get address(): string {
    return this.service.config.addresses.veNFTE;
  }
}
