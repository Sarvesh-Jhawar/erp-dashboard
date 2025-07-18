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

import jakarta.servlet.http.HttpSession;
@CrossOrigin(origins = "*")
@RestController
public class LoginController {

    @Autowired
    private AttendanceService attendanceService;
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
            return attendanceService.parseAndCalculate(jsonOutput);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Login error: " + e.getMessage());
        }
    }
}