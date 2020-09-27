const ACCESS = 'access';
const BLOCK_START = '@blockStart';
const BLOCK_END = '@blockEnd';
const COMPARE = 'compare';
const DONE = '@done';
const INDEX_MIN = '@indexMin';
const SET = 'set';
const SWAP = 'swap';
const TEMP = 'temp';
const TEMP_RESTORE = 'tempRestore';
const WAIT = 'wait';

const access = {
  action: (i: number) => ({ type: ACCESS, payload: i }),
  reducer: (state: any, i: number) => {
    const [block, ...rest] = state.blocks;
    return {
      ...state,
      blocks: [{ ...block, action: { type: ACCESS, target: i } }, ...rest],
    };
  },
};

const blockStart = {
  action: () => ({ type: BLOCK_START }),
  reducer: (state: any) => ({ ...state, blocks: [{}, ...state.blocks] }),
};

const blockEnd = {
  action: () => ({ type: BLOCK_END }),
  reducer: (state: any) => ({ ...state, blocks: state.blocks.slice(1) }),
};

const compare = {
  action: (i: number, j: number) => ({ type: COMPARE, payload: [i, j] }),
  reducer: (state: any, [i, j]: number[]) => {
    const [block, ...rest] = state.blocks;
    return {
      ...state,
      blocks: [{ ...block, action: { type: COMPARE, target: [i, j] } }, ...rest],
    };
  },
};

const done = {
  action: (i: number) => ({ type: DONE, payload: i }),
  reducer: (state: any, i: number) => ({ ...state, done: [...(state.done || []), i] }),
};

const indexMin = {
  action: (i: number) => ({ type: INDEX_MIN, payload: i }),
  reducer: (state: any, i: number) => {
    const [block, ...rest] = state.blocks;
    return {
      ...state,
      blocks: [{ ...block, indexMin: i }, ...rest],
    };
  },
};

const set = {
  action: (i: number, j: number) => ({ type: SET, payload: [i, j] }),
  reducer: (state: any, [i, j]: number[]) => {
    const items = state.items.slice();
    items[j] = items[i];
    const [block, ...rest] = state.blocks;
    return {
      ...state,
      blocks: [{ ...block, action: { type: SET, target: [i, j] } }, ...rest],
      items: items.map((item: any, i: number) => ({ ...item, i })),
    };
  },
};

const swap = {
  action: (i: number, j: number) => ({ type: SWAP, payload: [i, j] }),
  reducer: (state: any, [i, j]: number[]) => {
    const items = state.items.slice();
    [items[i], items[j]] = [items[j], items[i]];
    const [block, ...rest] = state.blocks;
    return {
      ...state,
      blocks: [{ ...block, action: { type: SWAP, target: [i, j] } }, ...rest],
      items: items.map((item: any, i: number) => ({ ...item, i })),
    };
  },
};

const temp = {
  action: (i: number) => ({ type: TEMP, payload: i }),
  reducer: (state: any, i: number) => {
    const [block, ...rest] = state.blocks;
    return {
      ...state,
      blocks: [{ ...block, temp: state.items[i] }, ...rest],
    };
  },
};

const tempRestore = {
  action: (i: number) => ({ type: TEMP_RESTORE, payload: i }),
  reducer: (state: any, i: number) => {
    const [block, ...rest] = state.blocks;
    if (block.temp) {
      const items = state.items.slice();
      items[i] = block.temp;
      return {
        ...state,
        blocks: [{ ...block, temp: undefined, action: { type: TEMP_RESTORE, target: i } }, ...rest],
        items: items.map((item: any, i: number) => ({ ...item, i })),
      };
    }
  },
};

const wait = {
  action: () => ({ type: WAIT }),
  reducer: (state: any) => state,
};

export const visual_access = access.action;
export const visual_blockStart = blockStart.action;
export const visual_blockEnd = blockEnd.action;
export const visual_compare = compare.action;
export const visual_done = done.action;
export const visual_indexMin = indexMin.action;
export const visual_set = set.action;
export const visual_swap = swap.action;
export const visual_temp = temp.action;
export const visual_tempRestore = tempRestore.action;
export const visual_wait = wait.action;

const reducers: any = {
  [ACCESS]: access.reducer,
  [BLOCK_START]: blockStart.reducer,
  [BLOCK_END]: blockEnd.reducer,
  [COMPARE]: compare.reducer,
  [DONE]: done.reducer,
  [INDEX_MIN]: indexMin.reducer,
  [SET]: set.reducer,
  [SWAP]: swap.reducer,
  [TEMP]: temp.reducer,
  [TEMP_RESTORE]: tempRestore.reducer,
  [WAIT]: wait.reducer,
};

export function reducer(state: any, { type, payload }: any) {
  if (typeof reducers[type] === 'function') {
    return reducers[type](state, payload);
  }
  switch (type) {
    case 'INIT':
      return { blocks: [{}], items: payload };
    default:
      return state;
  }
}
