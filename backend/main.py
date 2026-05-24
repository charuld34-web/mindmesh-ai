from fastapi import FastAPI
import random

app = FastAPI()

employees = [
    {
        "name": "Rahul",
        "work_hours": 5,
        "task_completion": 60,
        "stress_level": 80
    },
    {
        "name": "Priya",
        "work_hours": 9,
        "task_completion": 92,
        "stress_level": 30
    },
    {
        "name": "Aman",
        "work_hours": 4,
        "task_completion": 40,
        "stress_level": 90
    }
]

@app.get("/")
def home():
    return {"message": "MindMesh AI Infinity Backend Running"}

@app.get("/employees")
def get_employees():
    return employees

@app.get("/predict/{employee_id}")
def predict(employee_id: int):

    employee = employees[employee_id]

    score = (
        employee["task_completion"]
        - employee["stress_level"]
        + (employee["work_hours"] * 5)
    )

    risk = "LOW"

    if score < 40:
        risk = "HIGH"
    elif score < 70:
        risk = "MEDIUM"

    return {
        "employee": employee["name"],
        "productivity_score": score,
        "risk_level": risk
    }