import { useEffect, useRef } from 'react'

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

export async function retryFetch(url: string, body: object, retryLimit: number = 10) {
  let successfullyFetched = false;
  let counter = 0;
  while(!successfullyFetched) {
    let fetchResponse;
    try {
        fetchResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        })
        if(fetchResponse?.status === 503 || fetchResponse?.status === 502) {
            console.log(fetchResponse?.status)
            await asyncDelay(1000)
            if(counter === retryLimit) break;
            counter++;
            continue
        } else {
            console.log(fetchResponse?.status)
        }
        successfullyFetched= true
    } catch (error) {}
  }
  return successfullyFetched;
}

export async function getClientIp(){
  const ipResponse = await fetch("https://api.ipify.org?format=json");
  const ipData = await ipResponse.json();
  return ipData.ip
}