aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 683413213832.dkr.ecr.eu-central-1.amazonaws.com

docker build -t 3coweb:latest .

docker tag 3coweb:latest 683413213832.dkr.ecr.eu-central-1.amazonaws.com/3coweb

docker push 683413213832.dkr.ecr.eu-central-1.amazonaws.com/3coweb:latest