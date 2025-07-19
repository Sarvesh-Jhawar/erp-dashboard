package com.tech.ProjectBunk.Service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.context.annotation.Bean;
import java.util.Properties;

@Service
public class NotificationService {

    @Value("${spring.mail.host:smtp.gmail.com}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username:your-email@gmail.com}")
    private String mailUsername;

    @Value("${spring.mail.password:your-app-password}")
    private String mailPassword;

    @Value("${spring.mail.properties.mail.smtp.auth:true}")
    private String mailAuth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}")
    private String mailStartTls;

    private JavaMailSender mailSender;

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", mailAuth);
        props.put("mail.smtp.starttls.enable", mailStartTls);
        props.put("mail.debug", "true");

        this.mailSender = mailSender;
        return mailSender;
    }

    public void sendAttendanceAlert(String userEmail, String rollNumber, double attendancePercentage, String alertType) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailUsername);
            message.setTo(userEmail);
            message.setSubject("⚠️ Attendance Alert - " + alertType);
            
            String body = generateEmailBody(rollNumber, attendancePercentage, alertType);
            message.setText(body);
            
            if (mailSender != null) {
                mailSender.send(message);
                System.out.println("Attendance alert email sent to: " + userEmail);
            } else {
                System.out.println("Mail sender not configured, skipping email notification");
            }
        } catch (Exception e) {
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }

    private String generateEmailBody(String rollNumber, double attendancePercentage, String alertType) {
        StringBuilder body = new StringBuilder();
        body.append("Dear Student,\n\n");
        body.append("This is an automated attendance alert from your Attendance Analyzer.\n\n");
        body.append("Roll Number: ").append(rollNumber).append("\n");
        body.append("Current Overall Attendance: ").append(String.format("%.2f", attendancePercentage)).append("%\n");
        body.append("Alert Type: ").append(alertType).append("\n\n");
        
        if (alertType.equals("CRITICAL")) {
            body.append("⚠️ CRITICAL ALERT: Your attendance has dropped below 65%!\n");
            body.append("You are at risk of being detained. Please attend classes immediately.\n\n");
        } else if (alertType.equals("WARNING")) {
            body.append("⚠️ WARNING: Your attendance has dropped below 75%!\n");
            body.append("You need to improve your attendance to avoid condonation.\n\n");
        }
        
        body.append("Recommendations:\n");
        body.append("- Attend all upcoming classes\n");
        body.append("- Check your subject-wise attendance in the dashboard\n");
        body.append("- Contact your faculty if needed\n\n");
        body.append("Best regards,\nAttendance Analyzer Team");
        
        return body.toString();
    }

    public void checkAndSendNotifications(String userEmail, String rollNumber, double overallAttendance) {
        // Check for 75% threshold (WARNING)
        if (overallAttendance < 75.0 && overallAttendance >= 65.0) {
            sendAttendanceAlert(userEmail, rollNumber, overallAttendance, "WARNING");
        }
        // Check for 65% threshold (CRITICAL)
        else if (overallAttendance < 65.0) {
            sendAttendanceAlert(userEmail, rollNumber, overallAttendance, "CRITICAL");
        }
    }
} 