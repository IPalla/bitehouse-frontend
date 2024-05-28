docker image rm europe-north1-docker.pkg.dev/bite-house-burger/bhb-repository/bitehouse-frontend:latest --force
ng build --configuration=development
rm -r nginx-hosting/dist
mv dist nginx-hosting
cd nginx-hosting

docker build . --no-cache --tag europe-north1-docker.pkg.dev/bite-house-burger/bhb-repository/bitehouse-frontend:latest
docker push europe-north1-docker.pkg.dev/bite-house-burger/bhb-repository/bitehouse-frontend:latest