from fastapi import FastAPI
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse, FileResponse
from io import StringIO
import pandas as pd
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import random
from fastapi.middleware.cors import CORSMiddleware
from genetic_ann import run_genetic_algorithm
from fastapi import FastAPI, Request
from starlette.middleware.sessions import SessionMiddleware



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


class Metrics(BaseModel):
    accuracy: Optional[float]
    fitness: float
    loss : float 
    number_of_generations : int
    best_generation: int    


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), task: str = Form(...)):
    file_location = UPLOAD_DIR / file.filename

    with open(file_location, "wb") as f:
         f.write(await file.read())

    hist, _, fitness_list, accuracy, raw_loss, loss_list = run_genetic_algorithm(file_location)

<<<<<<< HEAD
@app.get("/csv/{name_csv}")
async def get_csv(name_csv: str):
    file_location = UPLOAD_DIR / name_csv
    if file_location.exists() and file_location.is_file():
        return FileResponse(path=file_location, filename=name_csv, media_type='text/csv')
    else:
        return JSONResponse(status_code=404, content={"message": "File not found"})


=======
    data = Metrics(
        accuracy=accuracy,
        fitness=max(fitness_list),
        loss=raw_loss,
        number_of_generations=len(fitness_list),   
        best_generation=fitness_list.index(max(fitness_list))  
    )

    return data.dict()
>>>>>>> 6bd42a6 (served model)
@app.get("/")
async def root():
   return {"main":"hello"}
