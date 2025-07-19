"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, BarChart3, Info, TrendingUp, TrendingDown, Calendar, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

interface AttendanceData {
  sn: number
  subject: string
  faculty: string
  held: number
  attended: number
  percentage: number
}

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [selectedSubject, setSelectedSubject] = useState("overall")
  const [showCriteria, setShowCriteria] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()

  useEffect(() => {
    const storedData = localStorage.getItem("attendanceData")
    const storedUsername = localStorage.getItem("bunk_username")

    if (storedData) {
      setAttendanceData(JSON.parse(storedData))
    }
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Show login success message
    const loginSuccess = localStorage.getItem("loginSuccess")
    if (loginSuccess === "true") {
      setTimeout(() => {
        localStorage.removeItem("loginSuccess")
      }, 3000)
    }
  }, [])

  const getMarks = (percentage: number) => {
    if (percentage >= 85) return 5
    if (percentage >= 80) return 4
    if (percentage >= 75) return 3
    if (percentage >= 70) return 2
    if (percentage >= 65) return 1
    return 0
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-green-400"
    if (percentage >= 65) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 75) return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Safe</Badge>
    if (percentage >= 65)
      return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Condonation</Badge>
    return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Detained</Badge>
  }

  const calculateOverallAttendance = () => {
    const totalHeld = attendanceData.reduce((sum, item) => sum + item.held, 0)
    const totalAttended = attendanceData.reduce((sum, item) => sum + item.attended, 0)
    return totalHeld === 0 ? 0 : (totalAttended / totalHeld) * 100
  }

  const calculateBunkableClasses = (attended: number, held: number, targetPercent: number) => {
    if (held === 0) return 0
    const n = Math.floor((attended * 100) / targetPercent - held)
    return n < 0 ? 0 : n
  }

  const calculateClassesToAttend = (attended: number, held: number, targetPercent: number) => {
    if (held === 0) return 0
    const required = (held * (targetPercent / 100) - attended) / (1 - targetPercent / 100)
    const x = Math.ceil(required)
    return x > 0 ? x : 0
  }

  const getSelectedData = () => {
    if (selectedSubject === "overall") {
      const totalHeld = attendanceData.reduce((sum, item) => sum + item.held, 0)
      const totalAttended = attendanceData.reduce((sum, item) => sum + item.attended, 0)
      return { attended: totalAttended, held: totalHeld }
    }
    const index = Number.parseInt(selectedSubject)
    return attendanceData[index] || { attended: 0, held: 0 }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push("/")
  }

  const overallPercentage = calculateOverallAttendance()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/analytics")}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-2 sm:px-3 h-8 sm:h-9"
              >
                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analytics</span>
                <span className="sm:hidden">Chart</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-xl border-white/20" align="end">
                  <DropdownMenuItem onClick={handleLogout} className="text-white hover:bg-white/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Message */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back, {username}!</h2>
          <p className="text-white/70 text-sm sm:text-base">Here's your attendance overview</p>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Overall Attendance</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold text-white mb-2">{overallPercentage.toFixed(1)}%</div>
              <Progress value={overallPercentage} className="mb-2" />
              {getStatusBadge(overallPercentage)}
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-white/90">Total Classes</CardTitle>
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="text-xl sm:text-2xl font-bold text-white">
                {attendanceData.reduce((sum, item) => sum + item.held, 0)}
              </div>
              <p className="text-xs text-white/70">
                {attendanceData.reduce((sum, item) => sum + item.attended, 0)} attended
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-4 sm:space-y-6">
          <TabsList className="bg-black/40 backdrop-blur-xl border-white/20 w-full sm:w-auto">
            <TabsTrigger
              value="subjects"
              className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base"
            >
              Subjects
            </TabsTrigger>
            <TabsTrigger
              value="calculator"
              className="data-[state=active]:bg-white/20 text-white flex-1 sm:flex-none text-sm sm:text-base"
            >
              Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects">
            <Card className="bg-black/40 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 px-4 sm:px-6">
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">Subject Wise Attendance</CardTitle>
                  <CardDescription className="text-white/70 text-sm">
                    Track your attendance across all subjects
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCriteria(!showCriteria)}
                  className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm"
                >
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Marks Criteria
                </Button>
              </CardHeader>
              <CardContent className="px-2 sm:px-6">
                {showCriteria && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mx-2 sm:mx-0">
                    <h4 className="font-semibold text-white mb-2 text-sm sm:text-base">Marks Criteria:</h4>
                    <div className="text-xs sm:text-sm text-white/80 space-y-1">
                      <div>≥85% = 5 marks</div>
                      <div>80-84% = 4 marks</div>
                      <div>75-79% = 3 marks</div>
                      <div>70-74% = 2 marks</div>
                      <div>65-69% = 1 mark</div>
                      <div>&lt;65% = 0 marks</div>
                    </div>
                  </div>
                )}

                {/* Mobile-optimized table */}
                <div className="overflow-x-auto">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow className="border-white/20">
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">S/N</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Subject</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                          Faculty
                        </TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Held</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Att.</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">%</TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                          Marks
                        </TableHead>
                        <TableHead className="text-white/90 text-xs sm:text-sm px-2 sm:px-4">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((item) => (
                        <TableRow key={item.sn} className="border-white/10">
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4">{item.sn}</TableCell>
                          <TableCell className="text-white font-medium text-xs sm:text-sm px-2 sm:px-4">
                            <div>
                              <div>{item.subject}</div>
                              <div className="text-white/60 text-xs sm:hidden">{item.faculty}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white/80 text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                            {item.faculty}
                          </TableCell>
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4">{item.held}</TableCell>
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4">{item.attended}</TableCell>
                          <TableCell
                            className={`font-semibold text-xs sm:text-sm px-2 sm:px-4 ${getStatusColor(item.percentage)}`}
                          >
                            <div>
                              {item.percentage.toFixed(1)}%
                              <div className="text-white/60 text-xs sm:hidden">
                                {getMarks(item.percentage) > 0 ? `${getMarks(item.percentage)} marks` : "0 marks"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-white text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                            {getMarks(item.percentage) > 0 ? getMarks(item.percentage) : "-"}
                          </TableCell>
                          <TableCell className="px-2 sm:px-4">{getStatusBadge(item.percentage)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Attendance Calculator</CardTitle>
                  <CardDescription className="text-white/70">
                    Calculate how many classes you can skip or need to attend
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Label htmlFor="subject-select" className="text-white/90 mb-2 block">
                      Select Subject
                    </Label>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-xl border-white/20">
                        <SelectItem value="overall" className="text-white">
                          Overall
                        </SelectItem>
                        {attendanceData.map((item, index) => (
                          <SelectItem key={index} value={index.toString()} className="text-white">
                            {item.subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardHeader>
                        <CardTitle className="text-green-400 flex items-center">
                          <TrendingDown className="w-5 h-5 mr-2" />
                          Classes You Can Skip
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-green-500/20">
                              <TableHead className="text-green-300">Target %</TableHead>
                              <TableHead className="text-green-300">Can Skip</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[90, 85, 80, 75, 70, 65].map((target) => {
                              const data = getSelectedData()
                              const canSkip = calculateBunkableClasses(data.attended, data.held, target)
                              return (
                                <TableRow key={target} className="border-green-500/10">
                                  <TableCell className="text-white">{target}%</TableCell>
                                  <TableCell className="text-green-400 font-semibold">{canSkip}</TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card className="bg-red-500/10 border-red-500/20">
                      <CardHeader>
                        <CardTitle className="text-red-400 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Classes You Must Attend
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow className="border-red-500/20">
                              <TableHead className="text-red-300">Target %</TableHead>
                              <TableHead className="text-red-300">Must Attend</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {[90, 85, 80, 75, 70, 65].map((target) => {
                              const data = getSelectedData()
                              const mustAttend = calculateClassesToAttend(data.attended, data.held, target)
                              return (
                                <TableRow key={target} className="border-red-500/10">
                                  <TableCell className="text-white">{target}%</TableCell>
                                  <TableCell className="text-red-400 font-semibold">{mustAttend}</TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">
            * This data is calculated based on your ERP data. For official records, always refer to your ERP portal.
          </p>
        </div>
      </div>
    </div>
  )
}
