'use client'

import { motion, useAnimationControls } from 'framer-motion'
import { useEffect } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function AuthQuote() {
  const controls = useAnimationControls()

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    })
  }, [controls])

  const quotationMarkVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    hover: {
      color: "rgb(52 211 153)", 
      y: -2,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="border-l border-zinc-800 bg-zinc-900 hidden flex-1 items-center justify-center lg:flex">
      <motion.figure
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        whileHover="hover"
        className="relative max-w-md space-y-6 p-8"
      >
        <motion.blockquote 
          className="relative space-y-2 italic text-zinc-300"
        >
          <motion.span 
            variants={quotationMarkVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4, duration: 0.5 }}
            className="absolute -top-2 -left-2 text-4xl text-zinc-700"
          >
            &ldquo;
          </motion.span>
          <motion.p 
            className="pl-6 text-lg leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Simple, secure authentication: your data, your rules. {' '}
            <TooltipProvider>
              <Tooltip delayDuration={50}>
                <TooltipTrigger className="border-b border-dashed border-emerald-500/40">
                  no complex setups
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Just a simple email/password or OAuth setup - no complicated configurations needed.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={50}>
                <TooltipTrigger className="border-b border-dashed border-emerald-500/40">
                  absurd scaling costs
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Unlike other auth providers that charge per user or have tiered pricing.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={50}>
                <TooltipTrigger className="border-b border-dashed border-emerald-500/40">
                  deprecation surprises
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">No more worrying about APIs being deprecated or changed without notice.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            , {' '}
            —just reliable custom rolled auth.
          </motion.p>
        </motion.blockquote>
      </motion.figure>
    </div>
  )
}
