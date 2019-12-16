# Ready-to-use Joker Docker
build_containers:
	docker build -t joker . && cd apiResearcher && docker build -t api-python-node .

docker: build_containers
	docker-compose up

# Webpack procedures
install:
	npm install && cd apiResearcher && npm install


