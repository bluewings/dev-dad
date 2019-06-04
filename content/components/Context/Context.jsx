import React, { useContext, useMemo } from 'react';
import { Context } from '../../../src/utils/context';

function ContextConsumer(props) {
  const { data, setData: setValue } = useContext(Context);

  const value = useMemo(() => data || {}, [data]);

  const { children } = props;
  const childrenFn = useMemo(() => (typeof children === 'function' ? children : null), [children]);

  return <>{childrenFn({ value, setValue })}</>;
}

export default ContextConsumer;
