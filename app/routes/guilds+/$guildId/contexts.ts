import { createContext } from 'react';
import type { LoaderResult } from './route';

export const LoaderDataContext = createContext<Partial<LoaderResult>>({});
