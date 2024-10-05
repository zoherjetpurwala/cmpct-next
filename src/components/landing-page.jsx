"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Baumans } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronRight, Link as LinkIcon, Zap } from "lucide-react"
import FlickeringGrid from "./ui/flickering-grid"

const baumans = Baumans({ weight: "400", subsets: ["latin"] })

export function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [urlInput, setUrlInput] = useState("")

  const handleLogin = (event) => {
    event.preventDefault()
    // Handle login logic here
  }

  const handleShorten = (event) => {
    event.preventDefault()
    // Handle URL shortening logic here
  }

  return (
    (<div
      className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 flex flex-col justify-center items-center px-4 overflow-hidden">
      
      <FlickeringGrid
        className="z-0 absolute inset-0 min-h-screen"
        squareSize={12}
        gridGap={6}
        color="#ffffff"
        maxOpacity={0.1}
        flickerChance={0.05}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }} />
      <div
        className="max-w-6xl mx-auto text-center text-white relative z-10 flex flex-col md:flex-row items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mb-12 md:mb-0">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${baumans.className} text-7xl md:text-9xl font-extrabold mb-8`}>
            cmpct.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl md:text-3xl mb-8 font-light">
            Shrink your links, expand your reach
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-blue-700 hover:bg-blue-100 transition-colors duration-300"
              onClick={() => setIsLoginModalOpen(true)}>
              Login
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors duration-300">
              Sign Up
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2">
          <form
            onSubmit={handleShorten}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Shorten Your URL</h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2">
              <Input
                type="url"
                placeholder="Enter your long URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-grow bg-white/20 border-0 text-white placeholder-blue-200"
                required />
              <Button type="submit" className="bg-green-500 hover:bg-green-600">
                Shorten <ChevronRight className="ml-2" />
              </Button>
            </div>
          </form>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-400" />}
              title="Lightning Fast"
              description="Generate short links in milliseconds" />
            <FeatureCard
              icon={<LinkIcon className="w-8 h-8 text-blue-400" />}
              title="Custom Links"
              description="Create branded and memorable URLs" />
          </div>
        </motion.div>
      </div>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="bg-white/10 backdrop-blur-2xl border-0 text-white mx-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Login to <span className="text-3xl">cmpct.</span>
            </DialogTitle>
            <DialogDescription className="text-center text-blue-100">
              Enter your credentials to access your account
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-blue-100">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  required
                  className="bg-white/20 border-0 text-white placeholder-blue-200" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-blue-100">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  required
                  className="bg-white/20 border-0 text-white placeholder-blue-200" />
              </div>
            </div>
            <Button className="w-full mt-6 bg-blue-500 hover:bg-blue-600" type="submit">
              Login
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>)
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    (<div
      className="bg-white/5 backdrop-blur-lg rounded-lg p-6 flex items-start space-x-4">
      {icon}
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-blue-100">{description}</p>
      </div>
    </div>)
  );
}