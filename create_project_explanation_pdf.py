from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem

output = r"d:\wev dev raj\Secure Auth\SecureAuth_HR_Interview_Guide.pdf"

doc = SimpleDocTemplate(output, pagesize=A4, rightMargin=48, leftMargin=48, topMargin=48, bottomMargin=48)
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleMono", parent=styles["Title"], alignment=TA_CENTER, textColor=colors.HexColor("#111111"), fontName="Helvetica-Bold", spaceAfter=18))
styles.add(ParagraphStyle(name="HeadingMono", parent=styles["Heading2"], textColor=colors.HexColor("#111111"), fontName="Helvetica-Bold", spaceBefore=12, spaceAfter=6))
styles.add(ParagraphStyle(name="BodyMono", parent=styles["BodyText"], textColor=colors.HexColor("#333333"), fontName="Helvetica", fontSize=10.5, leading=15, spaceAfter=8))

story = [
    Paragraph("SecureAuth", styles["TitleMono"]),
    Paragraph("Project Explanation Guide for HR Interviews", styles["Heading1"]),
    Spacer(1, 10),
]

def section(title, content):
    story.append(Paragraph(title, styles["HeadingMono"]))
    if isinstance(content, list):
        story.append(ListFlowable([ListItem(Paragraph(item, styles["BodyMono"])) for item in content], bulletType="bullet", leftIndent=18, bulletFontName="Helvetica", spaceAfter=8))
    else:
        story.append(Paragraph(content, styles["BodyMono"]))

section("30-second Introduction", "I built SecureAuth, a full-stack MERN authentication platform. It allows users to register, verify their email, log in securely, reset passwords, manage their profile, and access a protected dashboard. I built it using React and Vite on the frontend and Node.js, Express, MongoDB, and Mongoose on the backend. The application uses bcrypt for password hashing, HTTP-only JWT cookies for sessions, CSRF protection, rate limiting, Helmet security headers, and Nodemailer for transactional emails. I also added a responsive monochrome UI, centralized API handling, protected routes, automated backend tests, and production build validation.")

section("Responsibilities and Contributions", [
    "Designed and implemented the complete authentication workflow.",
    "Built reusable React components and protected routing.",
    "Developed REST APIs with validation and consistent error responses.",
    "Designed the MongoDB user schema and secure authentication token fields.",
    "Stored verification and password-reset tokens only as hashes.",
    "Implemented secure cookies and remember-me session durations.",
    "Added secure profile-management and password-change operations.",
    "Integrated SMTP email templates and project documentation.",
    "Tested critical authentication flows and created a Vite production build.",
])

section("Possible Interview Questions", "")
section("Why JWT with cookies?", "To combine stateless authentication with browser security. The JWT is stored in an HTTP-only cookie, reducing JavaScript access, while CSRF protection validates state-changing requests.")
section("How are passwords protected?", "Passwords are hashed with bcrypt before database storage, and plaintext passwords are never stored.")
section("How does password reset work?", "The server creates a cryptographically random token, stores only its hash, sends the original token by email, expires it after one hour, and invalidates it after use.")
section("How does email verification work?", "A secure random token is generated, hashed, and stored with an expiration. The link contains the original token, which is consumed after successful verification.")
section("How did you test it?", "I used Vitest and Supertest with an in-memory MongoDB server to test registration, duplicate prevention, login, invalid credentials, profile protection, password-reset behavior, and email-verification token handling.")

section("Skills to Highlight", [
    "MERN stack development",
    "REST API design",
    "Authentication and authorization",
    "Web application security",
    "MongoDB and Mongoose",
    "React state management",
    "Responsive UI development",
    "Automated testing",
    "Environment configuration",
    "Full project ownership",
])

section("Interview Tip", "Do not claim that the project is publicly deployed or that MongoDB is permanently running locally unless deployment and uptime have been verified.")

story.append(Spacer(1, 18))
story.append(Paragraph("Prepared for SecureAuth — November 22, 2026", styles["BodyMono"]))
doc.build(story)
print(output)
