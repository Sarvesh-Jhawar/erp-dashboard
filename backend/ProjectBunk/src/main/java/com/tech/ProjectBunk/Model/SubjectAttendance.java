package com.tech.ProjectBunk.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SubjectAttendance {
    private int bunk90;
private int bunk85;
private int bunk80;
private int bunk75;
private int bunk70;
private int bunk65;

private int attend90;
private int attend85;
private int attend80;
private int attend75;
private int attend70;
private int attend65;

    @JsonProperty("subject")
    private String subject; // This includes both code and name

    @JsonProperty("faculty")
    private String faculty;

    @JsonProperty("held")
    private String held; // initially a string in JSON

    @JsonProperty("attended")
    private String attended;

    @JsonProperty("percentage")
    private String percentage;

    private int maxBunksAllowed;

    public SubjectAttendance() {}

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public int getHeld() {
        try {
            return held == null || held.isEmpty() ? 0 : Integer.parseInt(held);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public void setHeld(String held) {
        this.held = held;
    }

    public int getAttended() {
        try {
            return attended == null || attended.isEmpty() ? 0 : Integer.parseInt(attended);
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    public void setAttended(String attended) {
        this.attended = attended;
    }

    public double getPercentage() {
        try {
            return percentage == null || percentage.isEmpty() ? 0.0 : Double.parseDouble(percentage);
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    public void setPercentage(String percentage) {
        this.percentage = percentage;
    }

    public int getMaxBunksAllowed() {
        return maxBunksAllowed;
    }

    public void setMaxBunksAllowed(int maxBunksAllowed) {
        this.maxBunksAllowed = maxBunksAllowed;
    }
    public int getBunk90() {
    return bunk90;
}

public void setBunk90(int bunk90) {
    this.bunk90 = bunk90;
}

public int getBunk85() {
    return bunk85;
}

public void setBunk85(int bunk85) {
    this.bunk85 = bunk85;
}

public int getBunk80() {
    return bunk80;
}

public void setBunk80(int bunk80) {
    this.bunk80 = bunk80;
}

public int getBunk75() {
    return bunk75;
}

public void setBunk75(int bunk75) {
    this.bunk75 = bunk75;
}

public int getBunk70() {
    return bunk70;
}

public void setBunk70(int bunk70) {
    this.bunk70 = bunk70;
}

public int getBunk65() {
    return bunk65;
}

public void setBunk65(int bunk65) {
    this.bunk65 = bunk65;
}

public int getAttend90() {
    return attend90;
}

public void setAttend90(int attend90) {
    this.attend90 = attend90;
}

public int getAttend85() {
    return attend85;
}

public void setAttend85(int attend85) {
    this.attend85 = attend85;
}

public int getAttend80() {
    return attend80;
}

public void setAttend80(int attend80) {
    this.attend80 = attend80;
}

public int getAttend75() {
    return attend75;
}

public void setAttend75(int attend75) {
    this.attend75 = attend75;
}

public int getAttend70() {
    return attend70;
}

public void setAttend70(int attend70) {
    this.attend70 = attend70;
}

public int getAttend65() {
    return attend65;
}

public void setAttend65(int attend65) {
    this.attend65 = attend65;
}

}
