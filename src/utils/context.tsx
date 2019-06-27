import React, { useReducer, useMemo } from 'react';

const SET_DATA = 'setData';

const initialState = { data: {} };

const DataContext = React.createContext(initialState);

const reducer = (state: any, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case SET_DATA: {
      const data = payload;
      return {
        ...state,
        data: {
          ...state.data,
          ...data,
        },
      };
    }
    default:
      break;
  }
  return state;
};

function DataProvider({ children }: any) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => {
    return {
      data: state.data,
      setData: (key: string, data: any) => {
        dispatch({
          type: SET_DATA,
          payload: { [key]: data },
        });
      },
    };
  }, [state, dispatch]);

  return <DataContext.Provider value={value}>{value && children}</DataContext.Provider>;
}

const Context = DataContext;
const Provider = DataProvider;

const action = {
  SET_DATA,
};

export { Context, Provider, action };
