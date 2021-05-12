// Copyright 2017-2021 @canvas-ui/react-util authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Api as ApiPromise } from '@cennznet/api';
import { ContractPromise as Contract } from '@polkadot/api-contract';

import { StringOrNull } from './types';
import { getContractAbi } from '.';

export default function getContractForAddress (api: ApiPromise, address: StringOrNull): Contract | null {
  if (!address) {
    return null;
  } else {
    const abi = getContractAbi(address);

    return abi
      ? new Contract(api, abi, address)
      : null;
  }
}
