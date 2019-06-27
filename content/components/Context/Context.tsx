import React, { useContext, useMemo } from 'react';
import { Context } from '../../../src/utils/context';

function ContextConsumer(props: any) {
  const { data, setData: setValue }: any = useContext(Context);

  const value = useMemo(() => data || {}, [data]);

  const { children } = props;
  const childrenFn = useMemo(() => (typeof children === 'function' ? children : null), [children]);

  return <>{childrenFn({ value, setValue })}</>;
}

export default ContextConsumer;
