"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"
import LiquidEffect from "./liquid-effect/liquid-effect"

export default function SplashScreen() {
  const [entering, setEntering] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [effectLoaded, setEffectLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show content with a slight delay for a smoother initial load
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Effect to manage body scrolling
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []); // Empty dependency array ensures this runs only once on mount and cleanup on unmount

  const handleEnter = () => {
    setEntering(true)

    // Navigate to main app after animation completes
    setTimeout(() => {
      router.push("/models")
    }, 800)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Liquid effect with background image */}
      <LiquidEffect
        imageUrl="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_4154-PGqg9PGBuKxLHK2TXQ2jjqQqH601cs.jpeg"
        onLoad={() => setEffectLoaded(true)}
      />

      {/* Loading indicator while effect is initializing */}
      <AnimatePresence>
        {!effectLoaded && (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content overlay */}
      <AnimatePresence>
        {showContent && effectLoaded && (
          <motion.div
            className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-center pb-16 md:pb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              onClick={handleEnter}
              className="group flex items-center space-x-2 px-8 py-3 bg-black bg-opacity-80 backdrop-blur-sm text-white rounded-full overflow-hidden relative hover:bg-opacity-100 transition-all duration-300"
              whileHover={{
                paddingRight: "2.5rem",
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              disabled={entering}
            >
              <span className="font-light tracking-wider text-sm">ENTER</span>
              <motion.div
                className="absolute right-3 opacity-0 group-hover:opacity-100"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight size={16} />
              </motion.div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen transition overlay */}
      <AnimatePresence>
        {entering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
