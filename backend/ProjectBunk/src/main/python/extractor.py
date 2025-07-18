import sys
import requests
from bs4 import BeautifulSoup
import json

roll_no = sys.argv[1]
password = sys.argv[2]

def extract_asp_fields(soup):
    return {
        "__VIEWSTATE": soup.find("input", {"name": "__VIEWSTATE"})["value"],
        "__VIEWSTATEGENERATOR": soup.find("input", {"name": "__VIEWSTATEGENERATOR"})["value"],
        "__EVENTVALIDATION": soup.find("input", {"name": "__EVENTVALIDATION"})["value"]
    }

try:
    # Initialize session
    session = requests.Session()
    login_url = "https://erp.cbit.org.in/Login.aspx"
    res = session.get(login_url)
    soup = BeautifulSoup(res.text, "html.parser")

    # Submit username
    asp_fields = extract_asp_fields(soup)
    payload_username = {
        **asp_fields,
        "txtUserName": roll_no,
        "btnNext": "Next"
    }
    res_username = session.post(login_url, data=payload_username)

    if "txtPassword" not in res_username.text:
        print(json.dumps({"error": "Username step failed"}))
        sys.exit(1)

    # Submit password
    soup2 = BeautifulSoup(res_username.text, "html.parser")
    asp_fields2 = extract_asp_fields(soup2)
    payload_password = {
        **asp_fields2,
        "txtPassword": password,
        "btnLogin": "Login"
    }
    res_login = session.post(login_url, data=payload_password)

    # Go to dashboard
    dashboard_url = "https://erp.cbit.org.in/StudentLogin/StudLoginDashboard.aspx"
    dashboard_res = session.get(dashboard_url)

    if "StudLoginDashboard" not in dashboard_res.url:
        print(json.dumps({"error": "Failed to load dashboard", "redirected_to": dashboard_res.url}))
        sys.exit(1)

    # Simulate student dashboard click
    soup_dashboard = BeautifulSoup(dashboard_res.text, "html.parser")
    asp_fields3 = extract_asp_fields(soup_dashboard)

    postback_payload = {
        **asp_fields3,
        "__EVENTTARGET": "ctl00$cpStud$lnkStudentMain",
        "__EVENTARGUMENT": ""
    }
    res_postback = session.post(dashboard_url, data=postback_payload)

    # Extract attendance table
    soup_attendance = BeautifulSoup(res_postback.text, "html.parser")
    attendance_table = soup_attendance.find("table", {"id": "ctl00_cpStud_grdSubject"})

    if not attendance_table:
        print(json.dumps({"error": "Couldn't find the attendance table"}))
        sys.exit(1)

    rows = attendance_table.find_all("tr")[1:]
    attendance_list = []
    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 6:
            continue

        data = {
            "subject": cols[1].get_text(strip=True),
            "faculty": cols[2].get_text(strip=True),
            "held": cols[3].get_text(strip=True),
            "attended": cols[4].get_text(strip=True),
            "percentage": cols[5].get_text(strip=True)
        }
        attendance_list.append(data)

    # Output final JSON
    print(json.dumps(attendance_list))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)