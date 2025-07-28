import React, { createContext, useContext } from 'react';

export const SwitchToVideoContext = createContext({ switchToVideo: null, setSwitchToVideo: () => {} });
export const useSwitchToVideo = () => useContext(SwitchToVideoContext); 