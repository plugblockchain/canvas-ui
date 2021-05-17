// Copyright 2017-2021 @polkadot/react-signer authors & contributors
// and @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableResult } from '@cennznet/api';
import { Signer, SignerResult } from '@cennznet/api/types';
import { ClassOf } from '@cennznet/types';
import { Hash } from '@cennznet/types/interfaces';
import { SignerPayloadJSON } from '@cennznet/types/types';

import { QueueTxMessageSetStatus, QueueTxPayloadAdd, QueueTxStatus } from './Status/types';
import { registry } from '.';

export default class ApiSigner implements Signer {
  readonly #queuePayload: QueueTxPayloadAdd;

  readonly #queueSetTxStatus: QueueTxMessageSetStatus;

  constructor (queuePayload: QueueTxPayloadAdd, queueSetTxStatus: QueueTxMessageSetStatus) {
    this.#queuePayload = queuePayload;
    this.#queueSetTxStatus = queueSetTxStatus;
  }

  public async signPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
    return new Promise((resolve, reject): void => {
      this.#queuePayload(payload, (id: number, result: SignerResult | null): void => {
        if (result) {
          resolve(result);
        } else {
          reject(new Error('Unable to sign'));
        }
      });
    });
  }

  public update (id: number, result: Hash | SubmittableResult): void {
    if (result instanceof ClassOf(registry, 'Hash')) {
      this.#queueSetTxStatus(id, 'sent', result.toHex());
    } else {
      this.#queueSetTxStatus(id, result.status.type.toLowerCase() as QueueTxStatus, status);
    }
  }
}
