package com.tech.ProjectBunk.Model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class NotificationPreferences {
    
    @JsonProperty("rollNumber")
    private String rollNumber;
    
    @JsonProperty("email")
    private String email;
    
    @JsonProperty("emailNotifications")
    private boolean emailNotifications = true;
    
    @JsonProperty("warningThreshold")
    private double warningThreshold = 75.0;
    
    @JsonProperty("criticalThreshold")
    private double criticalThreshold = 65.0;

    public NotificationPreferences() {}

    public NotificationPreferences(String rollNumber, String email) {
        this.rollNumber = rollNumber;
        this.email = email;
    }

    // Getters and Setters
    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public double getWarningThreshold() {
        return warningThreshold;
    }

    public void setWarningThreshold(double warningThreshold) {
        this.warningThreshold = warningThreshold;
    }

    public double getCriticalThreshold() {
        return criticalThreshold;
    }

    public void setCriticalThreshold(double criticalThreshold) {
        this.criticalThreshold = criticalThreshold;
    }
} 