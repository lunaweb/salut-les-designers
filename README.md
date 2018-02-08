# Prototype Middleman

## Installation

### Pré-requis

* Ruby 2.3.0 & Bundler 1.10

### Installation depuis le dépôt

    git clone git@github.com:lunaweb/salut-les-designers.git lunaweb-salut-les-designers --depth 1
    cd lunaweb-salut-les-designers
    rm -rf .git && git init

    # Dépendances de l'application
    bundle install --path=vendor/bundle --clean
    npm install

    bundle exec foreman start
