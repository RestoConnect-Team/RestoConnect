from fastapi import APIRouter, Depends, Response, Cookie
from sqlalchemy.orm import Session

from .connection_function import login, LoginRequest, LoginResponse
from .equipement_liste_function import get_user_equipement_liste_from_his_center, Equipement
# from .profil_function import get_user_profil
from .center_list_function import get_list_centers, CenterResponse
from .my_center_function import get_my_center_info, MyCenter
from .vehicules_function import get_list_vehicules, VehiculeListResponse

from app.database.connection import get_db

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login_endpoint(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    return login(credentials, response, db)

@router.get("/stock_list", response_model=list[Equipement])
def stock_list_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_user_equipement_liste_from_his_center(token, db)

# @router.get("/profil", response_model=Profil)
# def profil_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
#     return get_user_profil(token, db)

@router.get("/list_centers", response_model=list[CenterResponse])
def list_centers_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_centers(token, db)

@router.get("/my_center",response_model=MyCenter)
def get_my_center_info_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return(get_my_center_info(token,db))

@router.get("/list_vehicules", response_model=dict[str, list[VehiculeListResponse]])
def list_vehicules_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_vehicules(token, db)