docker image rm bitehouse-frontend
ng build --configuration=development
rm -r nginx-hosting/dist
mv dist nginx-hosting
cd nginx-hosting
docker build -t bitehouse-frontend .
docker run -dp 8080:8080 bitehouse-frontend
//gcloud build submit
//ng build --output-path docs --base-href /repository-name/
//ng build --configuration=development --output-path docs --base-href /bitehouse-frontend/