declare module 'scrollama';
declare module 'react-octicon';
declare module 'warpjs';

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}
