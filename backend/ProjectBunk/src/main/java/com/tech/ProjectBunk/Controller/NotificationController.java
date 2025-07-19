package com.tech.ProjectBunk.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.tech.ProjectBunk.Model.NotificationPreferences;
import com.tech.ProjectBunk.Service.NotificationService;
import com.tech.ProjectBunk.Service.AttendanceService;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AttendanceService attendanceService;

    // In-memory storage for notification preferences (in production, use a database)
    private static final Map<String, NotificationPreferences> userPreferences = new ConcurrentHashMap<>();

    @PostMapping("/preferences")
    public ResponseEntity<Map<String, Object>> saveNotificationPreferences(@RequestBody NotificationPreferences preferences) {
        try {
            userPreferences.put(preferences.getRollNumber(), preferences);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Notification preferences saved successfully");
            response.put("data", preferences);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to save preferences: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/preferences/{rollNumber}")
    public ResponseEntity<Map<String, Object>> getNotificationPreferences(@PathVariable String rollNumber) {
        try {
            NotificationPreferences preferences = userPreferences.get(rollNumber);
            
            Map<String, Object> response = new HashMap<>();
            if (preferences != null) {
                response.put("success", true);
                response.put("data", preferences);
            } else {
                response.put("success", false);
                response.put("message", "No preferences found for roll number: " + rollNumber);
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get preferences: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/check-attendance")
    public ResponseEntity<Map<String, Object>> checkAttendanceAndNotify(@RequestBody Map<String, Object> request) {
        try {
            String rollNumber = (String) request.get("rollNumber");
            String attendanceDataJson = (String) request.get("attendanceData");
            
            // Parse attendance data
            List<com.tech.ProjectBunk.Model.SubjectAttendance> attendanceList = 
                attendanceService.parseAndCalculate(attendanceDataJson);
            
            // Calculate overall attendance
            double overallAttendance = calculateOverallAttendance(attendanceList);
            
            // Get user preferences
            NotificationPreferences preferences = userPreferences.get(rollNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("overallAttendance", overallAttendance);
            response.put("notificationsSent", false);
            
            // Send notifications if preferences exist and attendance is below thresholds
            if (preferences != null) {
                if (preferences.isEmailNotifications() && preferences.getEmail() != null) {
                    notificationService.checkAndSendNotifications(
                        preferences.getEmail(), 
                        rollNumber, 
                        overallAttendance
                    );
                    response.put("notificationsSent", true);
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to check attendance: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/test-notification")
    public ResponseEntity<Map<String, Object>> testNotification(@RequestBody Map<String, Object> request) {
        try {
            String rollNumber = (String) request.get("rollNumber");
            String email = (String) request.get("email");
            String testType = (String) request.get("testType"); // "WARNING" or "CRITICAL"
            
            double testAttendance = testType.equals("CRITICAL") ? 60.0 : 70.0;
            
            if (email != null && !email.isEmpty()) {
                notificationService.sendAttendanceAlert(email, rollNumber, testAttendance, testType);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test notification sent successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to send test notification: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    private double calculateOverallAttendance(List<com.tech.ProjectBunk.Model.SubjectAttendance> attendanceList) {
        if (attendanceList == null || attendanceList.isEmpty()) {
            return 0.0;
        }
        
        int totalHeld = 0;
        int totalAttended = 0;
        
        for (com.tech.ProjectBunk.Model.SubjectAttendance attendance : attendanceList) {
            totalHeld += attendance.getHeld();
            totalAttended += attendance.getAttended();
        }
        
        if (totalHeld == 0) {
            return 0.0;
        }
        
        return (totalAttended * 100.0) / totalHeld;
    }
} 