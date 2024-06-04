from fastapi import FastAPI
from test_pygan import predict
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from io import StringIO
import pandas as pd
from pathlib import Path
app = FastAPI()

UPLOAD_DIR = Path("data")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
@app.get("/get_prediction/{run_id}")
def get_prediction(run_id):
    predictions, num_wrong, num_correct, accuracy = predict()
    return {"runId": run_id,
                       "num_wrong": num_wrong,
                       "num_correct":num_correct,
                       "accuracy": accuracy}


@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_location = UPLOAD_DIR / file.filename
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return {"info": f"file '{file.filename}' saved at '{file_location}'"}


@app.get("/")
async def root():
   return {"main":"hello"}
