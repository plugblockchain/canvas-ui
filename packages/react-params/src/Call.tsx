// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import FormatBalance from '@canvas-ui/react-components/FormatBalance';
import Static from '@canvas-ui/react-components/Static';
import { useTranslation } from '@canvas-ui/react-components/translate';
import { BareProps } from '@canvas-ui/react-components/types';
import { classes } from '@canvas-ui/react-util';
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { GenericCall, getTypeDef } from '@cennznet/types';
import { Hash } from '@cennznet/types/interfaces';
import { Codec, IExtrinsic, IMethod, TypeDef } from '@cennznet/types/types';

import Params from './Param/Params';

interface Props extends BareProps {
  children?: React.ReactNode;
  labelHash?: React.ReactNode;
  mortality?: string;
  onError?: () => void;
  value: IExtrinsic | IMethod;
  withBorder?: boolean;
  withHash?: boolean;
  tip?: BN;
}

interface Param {
  name: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

interface Extracted {
  hash: Hash | null;
  params: Param[];
  values: Value[];
}

function Call ({ children, className = '', labelHash, mortality, onError, tip, value, withBorder, withHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ hash, params, values }, setExtracted] = useState<Extracted>({ hash: null, params: [], values: [] });

  useEffect((): void => {
    const params = GenericCall.filterOrigin(value.meta).map(({ name, type }): Param => ({
      name: name.toString(),
      type: getTypeDef(type.toString())
    }));
    const values = value.args.map((value): Value => ({
      isValid: true,
      value
    }));
    const hash = withHash
      ? value.hash
      : null;

    setExtracted({ hash, params, values });
  }, [value, withHash]);

  return (
    <div className={classes('ui--Extrinsic', className)}>
      <Params
        isDisabled
        onError={onError}
        params={params}
        values={values}
        withBorder={withBorder}
      />
      {children}
      <div className='ui--Extrinsic--toplevel'>
        {hash && (
          <Static
            className='hash'
            label={labelHash || t<string>('extrinsic hash')}
          >
            {hash.toHex()}
          </Static>
        )}
        {mortality && (
          <Static
            className='mortality'
            label={t<string>('lifetime')}
          >
            {mortality}
          </Static>
        )}
        {tip?.gtn(0) && (
          <Static
            className='tip'
            label={t<string>('tip')}
          >
            <FormatBalance value={tip} />
          </Static>
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(Call)`
  .hash .ui--Static {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: unset;
    word-wrap: unset;
  }

  .ui--Extrinsic--toplevel {
    margin-top: 0.75rem;

    .ui--Labelled {
      padding-left: 0;

      label {
        left: 1.55rem;
      }
    }
  }
`);
