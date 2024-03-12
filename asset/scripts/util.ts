import { useEffect, useRef } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { RouteStackParamList } from './native-stack-navigation-types';

export const asyncDelay = async (ms: number) => new Promise(resolve => setTimeout(() => resolve(undefined), ms)) 

export function useDelayedEffect(callback: () => void, dependencies: any[], delay: number) {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }

    const timerId = setTimeout(tick, delay);

    return () => clearTimeout(timerId);
  }, [...dependencies, delay]);
}
export async function jobDelay(callback: () => void, ms: number) {
    return new Promise(resolve => setTimeout(() => {
      callback();
      resolve(null);
    }, ms))
}