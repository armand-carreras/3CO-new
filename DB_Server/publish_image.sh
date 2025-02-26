aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 683413213832.dkr.ecr.eu-central-1.amazonaws.com

docker build -t 3codbserver:latest .

docker tag 3codbserver:latest 683413213832.dkr.ecr.eu-central-1.amazonaws.com/3cowebdb

docker push 683413213832.dkr.ecr.eu-central-1.amazonaws.com/3cowebdb:latest