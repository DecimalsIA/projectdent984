#!/bin/bash

url="http://localhost:3000/api/gexplore"  # Reemplaza con la URL de tu API
data='{"userId": "pZzrHeGsqrGOhwI4CpYh", "mapNumber": 3, "valuePambii": 200}'

for i in {1..100}
do
  response=$(curl -s -X POST -H "Content-Type: application/json" -d "$data" "$url")
  echo "Response $i: $response"
done
