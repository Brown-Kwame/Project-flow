import { createContext, useContext } from 'react';

export const EndedCallContext = createContext({ endedCallId: null });
export const useEndedCall = () => useContext(EndedCallContext); 