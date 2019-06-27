import React, { useMemo } from 'react';
import useScrollama from './useScrollama';

function Scrollama(props: any) {
  const scrollInfo = useScrollama(props);

  const { children } = props;

  const childrenFn = useMemo(() => (typeof children === 'function' ? children : null), [children]);

  return <>{childrenFn(scrollInfo)}</>;
}

export default Scrollama;
