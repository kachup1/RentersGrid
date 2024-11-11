from flask import Blueprint, request, jsonify
import os
import requests
from itsdangerous import URLSafeTimedSerializer
from flask_bcrypt import Bcrypt  # For future password hashing, if needed
import jwt  # For future JWT token handling, if needed

# Set up Flask Blueprint
report_routes = Blueprint('report_routes', __name__)

# Environment variables
BREVO_API_KEY = os.getenv("BREVO_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "support@rentergrid.com")
serializer = URLSafeTimedSerializer("your_secret_key")  # Replace with a strong secret key

# Send report submission email function
def send_report_submission_email(to_email, landlordId, comment, categories, report_type):
    url = "https://api.brevo.com/v3/smtp/email"
    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "sender": {"email": FROM_EMAIL, "name": "RentersGrid"},
        "to": [{"email": to_email}],
        "subject": "Ticket Submission Notification",
        "htmlContent": f"""
            <div style="font-family: Arial, sans-serif; color: #333;">
                <p>There was a report submitted for RentersGrid.</p>
                <p><strong>Landlord ID:</strong> {landlordId}</p>
                <p><strong>Type:</strong> {report_type}</p>
                <p><strong>Categories:</strong> {', '.join(categories)}</p>
                <p><strong>Comment:</strong> {comment}</p>
            </div>
        """,
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 201:
        return True
    else:
        print(f"Failed to send email. Status Code: {response.status_code}, Response: {response.text}")
        return False

# Endpoint for submitting a report
@report_routes.route('/api/report', methods=['POST'])
def submit_report():
    data = request.json
    print("Received data:", data)  # Log the incoming data

    landlordId = data.get('landlordId')
    comment = data.get('comment')
    category = data.get('category')
    report_type = data.get('type')

    # Validate required fields
    if not landlordId:
        return jsonify({"message": "landlordId is required"}), 400
    if not comment:
        return jsonify({"message": "comment is required"}), 400
    if not category:
        return jsonify({"message": "category is required"}), 400
    if not report_type:
        return jsonify({"message": "type is required"}), 400

    # Process and send the email notification
    email_sent = send_report_submission_email(
        to_email="your_email@example.com",
        landlordId=landlordId,
        comment=comment,
        categories=[category],
        report_type=report_type
    )

    if email_sent:
        return jsonify({"message": "Report submitted successfully"}), 201
    else:
        return jsonify({"message": "Failed to send report notification"}), 500

