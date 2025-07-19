package com.tech.ProjectBunk.Controller;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.tech.ProjectBunk.Model.SubjectAttendance;
import com.tech.ProjectBunk.Service.AttendanceService;
import com.tech.ProjectBunk.Service.NotificationService;

import jakarta.servlet.http.HttpSession;
@CrossOrigin(origins = "*")
@RestController
public class LoginController {

    @Autowired
    private AttendanceService attendanceService;
    
    @Autowired
    private NotificationService notificationService;
     @PostMapping("/login")
public RedirectView loginUser(@RequestParam String username, HttpSession session) {
    session.setAttribute("username", username); // Store in session
    return new RedirectView("/dashboard.html");
}
  @PostMapping("/submit")
    public List<SubjectAttendance> handleLogin(
            @RequestParam("rollno") String rollNo,
            @RequestParam("password") String password) {

        try {
            System.out.println("Starting Python script with rollno: " + rollNo);

            ProcessBuilder pb = new ProcessBuilder("python", "src/main/python/extractor.py", rollNo, password);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Python Output: " + line);
                jsonBuilder.append(line);
            }

            int exitCode = process.waitFor();
            if (exitCode != 0) {
                throw new RuntimeException("Python script error, exited with code: " + exitCode);
            }

            String jsonOutput = jsonBuilder.toString();
            List<SubjectAttendance> attendanceList = attendanceService.parseAndCalculate(jsonOutput);
            
            // Check for notifications after processing attendance data
            checkAndSendNotifications(rollNo, attendanceList);
            
            return attendanceList;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Login error: " + e.getMessage());
        }
    }
    
    private void checkAndSendNotifications(String rollNumber, List<SubjectAttendance> attendanceList) {
        try {
            // Calculate overall attendance
            double overallAttendance = calculateOverallAttendance(attendanceList);
            
            // For now, we'll use a default email for testing
            // In production, you would retrieve user preferences from database
            String defaultEmail = "test@example.com"; // Replace with actual user email
            String defaultPhone = null; // Replace with actual user phone
            
            // Check if attendance is below thresholds and send notifications
            notificationService.checkAndSendNotifications(
                defaultEmail, 
                rollNumber, 
                overallAttendance
            );
            
            System.out.println("Attendance notification check completed for roll number: " + rollNumber);
        } catch (Exception e) {
            System.err.println("Error checking notifications: " + e.getMessage());
        }
    }
    
    private double calculateOverallAttendance(List<SubjectAttendance> attendanceList) {
        if (attendanceList == null || attendanceList.isEmpty()) {
            return 0.0;
        }
        
        int totalHeld = 0;
        int totalAttended = 0;
        
        for (SubjectAttendance attendance : attendanceList) {
            totalHeld += attendance.getHeld();
            totalAttended += attendance.getAttended();
        }
        
        if (totalHeld == 0) {
            return 0.0;
        }
        
        return (totalAttended * 100.0) / totalHeld;
    }
}