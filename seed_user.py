import bcrypt
from services.shared.database import SessionLocal
from services.shared.sql_models import User

def seed_user():
    db = SessionLocal()
    email = "user@example.com"
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Direct bcrypt hashing to bypass passlib bug
        password = "password".encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_pw = bcrypt.hashpw(password, salt).decode('utf-8')
        user = User(
            email=email,
            full_name="Default User",
            hashed_password=hashed_pw,
            is_superuser=True
        )
        db.add(user)
        db.commit()
        print(f"User {email} created successfully.")
    else:
        print(f"User {email} already exists.")
    db.close()

if __name__ == "__main__":
    seed_user()
