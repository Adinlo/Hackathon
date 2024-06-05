from fastapi import FastAPI, File, UploadFile, Form, Depends
from fastapi.responses import JSONResponse, FileResponse 
from pandas.core.series import deprecate_nonkeyword_arguments
from sqlalchemy import DateTime, create_engine, Column, Integer, Float, String, ForeignKey, exc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional
from pathlib import Path
import shutil
from fastapi.middleware.cors import CORSMiddleware
from genetic_ann import run_genetic_algorithm
from datetime import datetime
import random

DATABASE_URL = "mysql+pymysql://admin:esgiiabd@automl.cywnblyoo1nd.eu-west-3.rds.amazonaws.com/automl"
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("output")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)



class MetricsDB(Base):
    __tablename__ = 'Metrics'
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, nullable=False)
    accuracy = Column(Float)
    rmse = Column(Float)
    fitness = Column(Float)
    loss = Column(Float)
    pathCsv = Column(String)
    createdAt = Column(DateTime(timezone=True))
    updatedAt = Column(DateTime(timezone=True))
    



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/upload/{user_id}")
async def upload_file(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_location = UPLOAD_DIR / file.filename
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    hist, _, fitness_list, accuracy, raw_loss, loss_list = run_genetic_algorithm(str(file_location))

    data = MetricsDB(
        userId=user_id,
        accuracy=accuracy,
        fitness=max(fitness_list),
        loss=raw_loss,
        rmse=0.0,
        pathCsv = str(random.randint(1,56)),
        createdAt = datetime.now(),
        updatedAt = datetime.now(),
    )

    try:
        db.add(data)
        db.commit()
        return {"message": "Metrics stored successfully", "metrics": data}
    except exc.SQLAlchemyError as e:
        db.rollback()
        return {"error": "Failed to store metrics in database", "message": str(e)}

@app.get("/csv/{name_csv}")
async def get_csv(name_csv: str):
    file_location = UPLOAD_DIR / name_csv
    if file_location.exists() and file_location.is_file():
        return FileResponse(path=file_location, filename=name_csv, media_type='text/csv')
    else:
        return JSONResponse(status_code=404, content={"message": "File not found"})

@app.get("/")
async def root():
    return {"main": "hello"}