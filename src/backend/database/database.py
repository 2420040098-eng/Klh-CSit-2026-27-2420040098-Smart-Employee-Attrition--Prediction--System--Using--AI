import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Support running from root, src/backend, or container
base_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
root_dir = os.path.dirname(os.path.dirname(base_backend_dir))

candidate_paths = [
    os.path.join(base_backend_dir, "data", "attrition_system.db"),
    os.path.join(root_dir, "data", "attrition_system.db"),
    os.path.join(os.path.dirname(base_backend_dir), "data", "attrition_system.db"),
    os.path.join(os.getcwd(), "data", "attrition_system.db"),
]

DB_PATH = next((p for p in candidate_paths if os.path.exists(p)), candidate_paths[0])
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
