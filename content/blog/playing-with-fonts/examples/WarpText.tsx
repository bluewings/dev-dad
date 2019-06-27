import React from 'react';
import { WarpText as BaseWarpText } from 'react-warp-text';
import useTheme from '../../../../src/hooks/useTheme';

function transform([x, y, { innerHeight, scale, offset }]: any) {
  const wave = scale(0.2);
  let z = y / innerHeight - 0.1;
  z = z < 0 ? 0 : z;
  z = 1;
  return [x, y + wave * Math.sin((x + scale(offset) / 1000) / scale(0.5)) * z];
}

function paddingTop({ scale }: any) {
  return scale(0.2) + 2;
}

function WarpText(props: any) {
  const theme = useTheme();

  const wrapTextProps = {
    transform,
    padding: 2,
    paddingTop,
    paddingBottom: paddingTop,
    color: theme === 'dark' ? '#fff' : '#000',
    animate: false,
    message: '아빠는 개발자',
    ...props,
  };

  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <BaseWarpText {...wrapTextProps} />
    </div>
  );
}

function transform1([x, y, { innerHeight, scale, offset }]: any) {
  const wave = scale(0.2);
  const z = Math.max(0, y / innerHeight - 0.1);
  return [x, y + wave * Math.sin((x + scale(offset) / 400 / 2) / scale(0.5)) * z];
}

function transform2([x, y, { scale, offset }]: any) {
  const wave = scale(0.02);
  return [
    x + wave * Math.sin((y + scale(offset) / 2000) / scale(0.05)),
    y + wave * Math.sin((x + scale(offset) / 2000) / scale(0.05)),
  ];
}

function transform3([x, y, { scale, offset }]: any) {
  const wave = scale(0.2);
  return [
    x + wave * Math.sin((y + scale(offset) / 1000) / scale(0.5)),
    y + wave * Math.sin((x + scale(offset) / 1000) / scale(0.5)),
  ];
}

function transform4([x, y, { scale, offset, charX }]: any) {
  const wave = scale(0.5);
  return [x, y - wave * Math.abs(Math.sin((charX + scale(offset) / 600) / scale(0.4)))];
}

function paddingTop4({ scale }: any) {
  return scale(0.5) + 2;
}

function transformA1([x, y, { innerHeight }]: any) {
  return [x + innerHeight - y, innerHeight * 0.5 + y * 0.5 + x / 3];
}
function transformA2([x, y]: any) {
  return [x, y + x / 3];
}

export default WarpText;

export { transform1, transform2, transform4, paddingTop4, paddingTop, transform3, transformA1, transformA2 };
