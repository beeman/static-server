IMAGE=beeman/static-server:latest

build:
	@docker build . -f Dockerfile -t ${IMAGE}

push:
	@docker push ${IMAGE}

run:
	@docker run -it -p 9876:9876 -e ENV_API_URL='https://api.example.com/' --rm --name static-server ${IMAGE}

run-sh:
	@docker run -it -p 9876:9876 -e ENV_API_URL='https://api.example.com/' --rm --name static-server ${IMAGE} sh


