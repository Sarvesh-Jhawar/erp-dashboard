"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart3, TrendingUp, Target, Award } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChartContainer } from "@/components/ui/chart"

interface AttendanceData {
  sn: number
  subject: string
  faculty: string
  held: number
  attended: number
  percentage: number
}

export default function Analytics() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    const storedData = localStorage.getItem("attendanceData")
    if (storedData) {
      setAttendanceData(JSON.parse(storedData))
    }
  }, [])

  const chartData = attendanceData.map((item) => ({
    subject: item.subject,
    percentage: item.percentage,
    attended: item.attended,
    held: item.held,
  }))

  const getStatusStats = () => {
    const safe = attendanceData.filter((item) => item.percentage >= 75).length
    const condonation = attendanceData.filter((item) => item.percentage >= 65 && item.percentage < 75).length
    const detained = attendanceData.filter((item) => item.percentage < 65).length
    return { safe, condonation, detained }
  }

  const stats = getStatusStats()
  const overallPercentage =
    attendanceData.length > 0
      ? attendanceData.reduce((sum, item) => sum + item.percentage, 0) / attendanceData.length
      : 0

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-white hover:bg-white/10 px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Analytics
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Overall Average</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-white">{overallPercentage.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Safe Subjects</CardTitle>
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-green-400">{stats.safe}</div>
              <p className="text-xs text-white/70">≥75% attendance</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Condonation</CardTitle>
              <Award className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-yellow-400">{stats.condonation}</div>
              <p className="text-xs text-white/70">65-74% attendance</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">At Risk</CardTitle>
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-lg sm:text-2xl font-bold text-red-400">{stats.detained}</div>
              <p className="text-xs text-white/70">&lt;65% attendance</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {/* Bar Chart */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-white text-lg sm:text-xl">Subject-wise Attendance</CardTitle>
              <CardDescription className="text-white/70 text-sm">Attendance percentage by subject</CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <ChartContainer
                config={{
                  percentage: {
                    label: "Attendance %",
                    color: "hsl(217, 91%, 60%)",
                  },
                }}
                className="h-[250px] sm:h-[300px]"
              >
                <div className="w-full h-full">
                  <svg viewBox="0 0 400 300" className="w-full h-full">
                    <defs>
                      <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map((y, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1={250 - y * 2}
                        x2="380"
                        y2={250 - y * 2}
                        stroke="#374151"
                        strokeDasharray="2,2"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Y-axis labels */}
                    {[0, 25, 50, 75, 100].map((y, i) => (
                      <text key={i} x="40" y={255 - y * 2} fill="#9CA3AF" fontSize="12" textAnchor="end">
                        {y}%
                      </text>
                    ))}

                    {/* Bars */}
                    {chartData.map((item, index) => {
                      const barWidth = 40
                      const barSpacing = 60
                      const x = 70 + index * barSpacing
                      const barHeight = (item.percentage / 100) * 200
                      const y = 250 - barHeight

                      return (
                        <g key={index}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            fill="url(#barGradient)"
                            rx="4"
                            ry="4"
                          />
                          <text x={x + barWidth / 2} y="270" fill="#9CA3AF" fontSize="12" textAnchor="middle">
                            {item.subject}
                          </text>
                          <text
                            x={x + barWidth / 2}
                            y={y - 5}
                            fill="#FFFFFF"
                            fontSize="11"
                            textAnchor="middle"
                            fontWeight="bold"
                          >
                            {item.percentage.toFixed(1)}%
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-white text-lg sm:text-xl">Attendance Distribution</CardTitle>
              <CardDescription className="text-white/70 text-sm">Visual breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="h-[250px] sm:h-[300px] flex items-center justify-center">
                <svg viewBox="0 0 300 300" className="w-full h-full max-w-[200px] sm:max-w-[250px]">
                  {chartData.map((item, index) => {
                    const total = chartData.reduce((sum, d) => sum + d.percentage, 0)
                    const percentage = (item.percentage / total) * 100
                    const angle = (percentage / 100) * 360
                    const startAngle = chartData
                      .slice(0, index)
                      .reduce((sum, d) => sum + (d.percentage / total) * 360, 0)

                    const centerX = 150
                    const centerY = 150
                    const radius = 80

                    const startAngleRad = (startAngle * Math.PI) / 180
                    const endAngleRad = ((startAngle + angle) * Math.PI) / 180

                    const x1 = centerX + radius * Math.cos(startAngleRad)
                    const y1 = centerY + radius * Math.sin(startAngleRad)
                    const x2 = centerX + radius * Math.cos(endAngleRad)
                    const y2 = centerY + radius * Math.sin(endAngleRad)

                    const largeArcFlag = angle > 180 ? 1 : 0

                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ")

                    return (
                      <g key={index}>
                        <path d={pathData} fill={COLORS[index % COLORS.length]} opacity="0.8" />
                      </g>
                    )
                  })}

                  {/* Center circle */}
                  <circle cx="150" cy="150" r="30" fill="rgba(0,0,0,0.8)" />
                  <text x="150" y="155" fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">
                    {overallPercentage.toFixed(1)}%
                  </text>
                </svg>
              </div>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-white text-xs sm:text-sm">
                      {item.subject}: {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis */}
        <Card className="mt-8 bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Detailed Analysis</CardTitle>
            <CardDescription className="text-white/70">Subject performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceData.map((item, index) => (
                <div key={item.sn} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div>
                      <h4 className="text-white font-medium">{item.subject}</h4>
                      <p className="text-white/70 text-sm">{item.faculty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {item.attended}/{item.held} classes
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        item.percentage >= 75
                          ? "text-green-400"
                          : item.percentage >= 65
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
