// Copyright 2017-2021 @polkadot/test-support authors & contributors
// and @canvas-ui/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Api as ApiPromise } from '@cennznet/api';
import { WsProvider } from '@polkadot/rpc-provider';

import { SUBSTRATE_PORT } from '../substrate';

export async function createApi (): Promise<ApiPromise> {
  process.env.NODE_ENV = 'test';

  const provider = new WsProvider(`ws://127.0.0.1:${SUBSTRATE_PORT}`);

  const api = await ApiPromise.create({ provider });

  const [chain, nodeName, nodeVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  console.log(`You are connected to chain ${chain.toString()} using ${nodeName.toString()} v${nodeVersion.toString()}`);

  return api;
}
