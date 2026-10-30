from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database.database import get_db
from database.models import RetentionAction, Employee

router = APIRouter(prefix="/api/retention-actions", tags=["Retention Management"])

class ActionCreate(BaseModel):
    employee_id: int
    action_type: str
    title: str
    priority: str = "Medium"
    status: str = "Planned"
    assigned_hr: str = "HR Retention Partner"
    notes: Optional[str] = None
    target_date: Optional[str] = None

class ActionUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assigned_hr: Optional[str] = None
    notes: Optional[str] = None
    target_date: Optional[str] = None

@router.get("")
def list_retention_actions(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(RetentionAction).join(Employee)
    if status and status != "All":
        query = query.filter(RetentionAction.status == status)
    if priority and priority != "All":
        query = query.filter(RetentionAction.priority == priority)

    actions = query.order_by(RetentionAction.created_at.desc()).all()
    results = []
    for a in actions:
        results.append({
            "id": a.id,
            "employee_id": a.employee_id,
            "employee_number": a.employee.employee_number if a.employee else None,
            "employee_name": a.employee.full_name if a.employee else None,
            "employee_role": a.employee.job_role if a.employee else None,
            "department": a.employee.department if a.employee else None,
            "action_type": a.action_type,
            "title": a.title,
            "priority": a.priority,
            "status": a.status,
            "assigned_hr": a.assigned_hr,
            "notes": a.notes,
            "target_date": a.target_date,
            "created_at": a.created_at.isoformat() if a.created_at else None,
            "updated_at": a.updated_at.isoformat() if a.updated_at else None
        })
    return {"actions": results, "total": len(results)}

@router.post("")
def create_retention_action(req: ActionCreate, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == req.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    action = RetentionAction(
        employee_id=req.employee_id,
        action_type=req.action_type,
        title=req.title,
        priority=req.priority,
        status=req.status,
        assigned_hr=req.assigned_hr,
        notes=req.notes,
        target_date=req.target_date,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return {"message": "Retention action created", "action_id": action.id}

@router.patch("/{action_id}")
def update_retention_action(action_id: int, req: ActionUpdate, db: Session = Depends(get_db)):
    action = db.query(RetentionAction).filter(RetentionAction.id == action_id).first()
    if not action:
        raise HTTPException(status_code=404, detail="Retention action not found")

    if req.status is not None:
        action.status = req.status
    if req.priority is not None:
        action.priority = req.priority
    if req.assigned_hr is not None:
        action.assigned_hr = req.assigned_hr
    if req.notes is not None:
        action.notes = req.notes
    if req.target_date is not None:
        action.target_date = req.target_date
        
    action.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(action)
    return {"message": "Retention action updated successfully", "status": action.status}
