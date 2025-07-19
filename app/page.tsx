"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, BookOpen, School, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful login
      localStorage.setItem("bunk_username", username)
      localStorage.setItem("loginSuccess", "true")

      // Mock attendance data
      const mockData = [
        { sn: 1, subject: "SE", faculty: "Dr. Smith", held: 45, attended: 36, percentage: 80 },
        { sn: 2, subject: "EAD", faculty: "Prof. Johnson", held: 40, attended: 38, percentage: 95 },
        { sn: 3, subject: "ML", faculty: "Dr. Williams", held: 42, attended: 42, percentage: 100 },
        { sn: 4, subject: "CN", faculty: "Prof. Brown", held: 38, attended: 34, percentage: 90 },
        { sn: 5, subject: "FLAT", faculty: "Dr. Davis", held: 35, attended: 30, percentage: 85 },
      ]

      localStorage.setItem("attendanceData", JSON.stringify(mockData))
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating icons - hidden on mobile */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <GraduationCap className="absolute top-20 left-20 w-16 h-16 text-white/10 animate-float" />
        <School className="absolute bottom-20 right-20 w-20 h-20 text-white/10 animate-float delay-1000" />
        <BookOpen className="absolute top-1/2 left-10 w-14 h-14 text-white/10 animate-float delay-500" />
        <GraduationCap className="absolute top-20 right-10 w-12 h-12 text-white/10 animate-float delay-700" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-2 sm:p-4">
        <Card className="w-full max-w-md mx-2 bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Attendance Analyzer
            </CardTitle>
            <CardDescription className="text-blue-300 text-base sm:text-lg">
              Track Your Academic Attendance
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white/90 text-sm sm:text-base">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 h-11 sm:h-12 text-base"
                  placeholder="Enter your ERP username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/90 text-sm sm:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20 h-11 sm:h-12 text-base"
                  placeholder="Enter your password"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 h-12 sm:h-14 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="mt-6 space-y-2 text-center">
              <p className="text-yellow-400 text-xs sm:text-sm font-medium">
                * Use your ERP username and password to login
              </p>
              <p className="text-blue-300 text-xs sm:text-sm font-medium">* Only for CBIT students</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
