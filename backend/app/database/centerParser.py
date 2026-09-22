from .models import Center
from .models import Stock

class CsvParser:

  def getCentersFromCSV(self, file_name):
    centers = []
    with open(file_name, 'r', encoding='utf-8-sig') as file:
      lines = file.readlines()
    for line in lines:
      items = line.split(';')
      centers.append(Center(
        name = items[1],
        street_number = 0 if items[2] == '' else items[2],
        street = items[3],
        city = items[4],
        postal_code = items[5],
        telephone = items[6],
        email = items[7],
        status = items[8],
        description = items[9],
        activities = items[10],
      ))
    return centers

  def getEquipmentsFromCSV(self, file_name):
    equipments = []
    with open(file_name, 'r', encoding='utf-8-sig') as file:
      lines = file.readlines()
    for line in lines:
      items = line.split(';')
      equipments.append(Stock(
        reference = items[1],
        name = items[2],
        category = items[3],
        status = items[4],
        qr_code = items[5],
        creation_date = items[6],
        last_scan_date = items[7],
        center_id = items[8]
      ))
    return equipments
