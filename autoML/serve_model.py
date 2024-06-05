from fastapi import FastAPI
from test_pygan import predict
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from io import StringIO
import pandas as pd
from pathlib import Path
from pydantic import BaseModel
from typing import List
import random
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path("data")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

@app.get("/get_prediction/{run_id}")
def get_prediction(run_id):
    predictions, num_wrong, num_correct, accuracy = predict()
    return {"runId": run_id,
                       "num_wrong": num_wrong,
                       "num_correct":num_correct,
                       "accuracy": accuracy}

class Metrics(BaseModel):
    accuracy: float
    metric: float
    number_of_generations: int
    fitness: List[float]
    number_of_correct_predictions: int
    best_generation: int


@app.get("/metrics", response_model=Metrics)
async def get_metrics():
    number_of_generations = 50
    fitness = [random.uniform(0, 1) for _ in range(number_of_generations)]
    data = Metrics(
        accuracy=random.uniform(0.8, 1.0),
        metric=random.uniform(0.7, 0.9),
        number_of_generations=number_of_generations,
        fitness=fitness,
        number_of_correct_predictions=random.randint(400, 500),
        best_generation=random.randint(1, number_of_generations)
    )
    return data

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), task: str = Form(...)):
    file_location = UPLOAD_DIR / file.filename
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"info": f"file '{file.filename}' with task '{task}' saved at '{file_location}'"}


@app.get("/")
async def root():
   return {"main":"hello"}
