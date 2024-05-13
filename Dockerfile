FROM ruby:2.7.2

# Debian 9.8

ENV TZ=Europe/Paris
EXPOSE 4567
WORKDIR /var/www
SHELL ["/bin/bash", "-c"]

RUN gem install bundler -v 2.0
# RUN gem install middleman -v 4.4.0
# RUN gem install middleman-dato -v 0.10.0
# RUN gem install slim -v 1.1.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash && \
  source /root/.nvm/nvm.sh && \
  nvm install v12.6.0 && \
  nvm alias default v12.6.0 && \
  ln -s $(which node) /usr/bin/node

CMD ["tail", "-f", "/dev/null"]
