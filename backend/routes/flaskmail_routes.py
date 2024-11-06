from flask import Flask, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'your_mail_server'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = 'your_username'
app.config['MAIL_PASSWORD'] = 'your_password'
app.config['MAIL_DEFAULT_SENDER'] = 'rentersgrid@gmail.com'

mail = Mail(app)

@app.route('/SendEmail', methods=['POST'])
def send_email():
  data = request.get_json()
  recipient_email = data.get('email')

  if recipient_email:
    msg = Message(
        'do-not-reply',
        sender='rentersgrid@gmail.com',
        recipients=[recipient_email],
        body='Here is your link: http://localhost:3000/resetpasswordupdate'
    )
    mail.send(msg)
    return jsonify({'message': 'Email Sent!'}), 200
  return jsonify({'message': 'Email not provided!'}), 400