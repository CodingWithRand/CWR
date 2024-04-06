import React, { useState, useEffect, useCallback, useRef } from 'react';
import { asyncDelay, jobDelay } from '../scripts/util';
import { Animated, Text, StyleProp, TextStyle } from 'react-native';

type TypingTextPropsType= { animated?: boolean, text: string, style?: StyleProp<TextStyle>, delay: number, initialDelay?: number };
export function TypingText({ animated, text, style, delay, initialDelay }: TypingTextPropsType) {
  const [typedText, setTypedText] = useState<string>('');

  useEffect(() => {
    (async () => {
        if(initialDelay && typedText.length === 0) await asyncDelay(initialDelay)
        if(typedText !== text) await jobDelay(() => setTypedText(typedText + text[typedText.length]), delay)
    })()
  }, [typedText])
  
  return animated ? <Animated.Text style={style}>{typedText}</Animated.Text> : <Text style={style}>{typedText}</Text>
}

export function useIsMounted() {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
}