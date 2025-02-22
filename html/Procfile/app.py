from flask import Flask, render_template
from flask_socketio import SocketIO, send
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ваш_секретный_ключ'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///messages.db'  # Файл базы данных
db = SQLAlchemy(app)
socketio = SocketIO(app)

# Модель для сообщений
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(500), nullable=False)

# Создание базы данных (если её нет)
with app.app_context():
    db.create_all()

# Главная страница
@app.route('/')
def index():
    messages = Message.query.all()  # Получаем все сообщения из базы данных
    return render_template('index.html', messages=messages)

# Обработка сообщений
@socketio.on('message')
def handle_message(message):
    print(f"Получено сообщение: {message}")
    # Сохраняем сообщение в базе данных
    new_message = Message(content=message)
    db.session.add(new_message)
    db.session.commit()
    # Отправляем сообщение всем клиентам
    send(message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)