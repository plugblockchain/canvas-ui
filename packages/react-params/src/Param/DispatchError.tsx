// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Input } from '@canvas-ui/react-components';
import { useTranslation } from '@canvas-ui/react-components/Params/translate';
import { Props } from '@canvas-ui/react-components/types';
import React, { useEffect, useState } from 'react';

import { DispatchError } from '@cennznet/types/interfaces';

import Static from './Static';
import Unknown from './Unknown';

interface ModuleErrorDefault {
  isModule?: boolean
}

interface Details {
  details?: string | null;
  type?: string;
}

function isModuleError (value?: ModuleErrorDefault): value is DispatchError {
  return !!value?.isModule;
}

function ErrorDisplay (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ details, type }, setDetails] = useState<Details>({});

  useEffect((): void => {
    const { value } = props.defaultValue || {};

    if (isModuleError(value as ModuleErrorDefault)) {
      try {
        const mod = (value as DispatchError).asModule;
        const { documentation, name, section } = mod.registry.findMetaError(mod);

        return setDetails({
          details: documentation.join(', '),
          type: `${section}.${name}`
        });
      } catch (error) {
        // Errors may not actually be exposed, in this case, just return the default representation
        console.error(error);
      }
    }

    setDetails({ details: null });
  }, [props.defaultValue]);

  if (!props.isDisabled || !details) {
    return <Unknown {...props} />;
  }

  return (
    <Static {...props}>
      <Input
        className='full'
        isDisabled
        label={t<string>('type')}
        value={type}
      />
      {details && (
        <Input
          className='full'
          isDisabled
          label={t<string>('details')}
          value={details}
        />
      )}
    </Static>
  );
}

export default React.memo(ErrorDisplay);
