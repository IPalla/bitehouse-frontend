docker image rm bitehouse-frontend
ng build --configuration=development
rm -r nginx-hosting/dist
mv dist nginx-hosting
cd nginx-hosting
docker build -t bitehouse-frontend .
docker run -dp 8080:8080 bitehouse-frontend
//gcloud build submit