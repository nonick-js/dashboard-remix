import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { createContext } from 'react';

export const ManagedMutualGuildsContext = createContext<RESTAPIPartialCurrentUserGuild[]>([]);
