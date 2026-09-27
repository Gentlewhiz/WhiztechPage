import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register once, in the browser only. The page is also prerendered in Node at build
// time, where GSAP must not run (see the gsap-react guidance on SSR).
if (typeof window !== 'undefined') gsap.registerPlugin(useGSAP, ScrollTrigger)

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const FINE_POINTER = '(pointer: fine) and (prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, useGSAP }
