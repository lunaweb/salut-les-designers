# Prototype Middleman

## Installation

### Pré-requis

* Docker

### Installation depuis le dépôt

    git clone git@github.com:lunaweb/salut-les-designers.git
    cd lunaweb-salut-les-designers

    docker-compose up

### Installation dans Docker

    # Ouvrir un terminal Docker
    docker exec -ti salutlesdesigners bash

    # Dans le terminal Docker
    bundle install --path=vendor/bundle --clean
    nvm use
    nvm install
    npm install

### Lancer le projet

    # Ouvrir un terminal Docker
    docker exec -ti salutlesdesigners bash

    # Lancer Middleman
    bundle exec foreman start
