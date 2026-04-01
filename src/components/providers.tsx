'use client'

import { ReducedMotionProvider } from '@/lib/motion'
import { SmoothScroll } from './smooth-scroll'

import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ReducedMotionProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </ReducedMotionProvider>
  )
}
