docker image rm bitehouse-frontend --force
ng build --configuration=development
rm -r nginx-hosting/dist
mv dist nginx-hosting
cd nginx-hosting
docker build -t bitehouse-frontend .
docker run -dp 8080:8080 bitehouse-frontend
//gcloud builds submit
//gcloud run deploy --image us.gcr.io/bite-house-burger/angular-nginx-container:latest --port 8080

//ng build --output-path docs --base-href /repository-name/
//ng build --configuration=development --output-path docs --base-href /bitehouse-frontend/
// europe-central2



//docker image rm bitehouse-frontend --force