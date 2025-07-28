import React, { createContext, useContext } from 'react';

export const CallSignalContext = createContext({ sendCallSignal: () => {} });
export const useCallSignal = () => useContext(CallSignalContext); 