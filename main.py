from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import os
app=FastAPI(title='FORENSIX Backend')
ADMIN_KEY=os.getenv('FORENSIX_ADMIN_KEY','CHANGE_THIS_SECRET')
PRIVATE_CASE_001={'solution':'The perpetrator impersonated a delivery worker, entered after the victim opened the door, attacked the victim, and left when the legitimate delivery worker approached.','critical_evidence':['E01','E04','E06','E07','E08'],'red_herrings':['E03']}
class Event(BaseModel):
    investigator:str
    evidence_id:str
    action:str
@app.get('/api/health')
def health(): return {'status':'ok'}
@app.post('/api/admin/case-001')
def admin_case_001(x_admin_key:str=Header(default='')):
    if x_admin_key!=ADMIN_KEY: raise HTTPException(status_code=403,detail='Forbidden')
    return PRIVATE_CASE_001
@app.post('/api/investigation/event')
def event(e:Event): return {'accepted':True,'event':e.model_dump()}
