from fastapi import APIRouter, Response
import qrcode
from io import BytesIO

router = APIRouter()

@router.get("/qr_code/{reference}")
async def get_qr_code_image(reference: str):
    # Générer le QR code à partir de la référence
    img = qrcode.make(reference)
    buf = BytesIO()
    img.save(buf, format="PNG")
    return Response(content=buf.getvalue(), media_type="image/png")
