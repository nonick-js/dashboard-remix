import { type Dispatch, type SetStateAction, createContext } from 'react';

export const FilterValueContext = createContext<{
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}>({
  value: '',
  setValue: () => {},
});
