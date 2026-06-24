FROM ruby:3.4-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    imagemagick \
    libxml2-dev \
    libxslt-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /site

RUN gem install bundler:2.4.12

COPY Gemfile Gemfile.lock ./

RUN BUNDLE_PATH=/usr/local/bundle bundle install

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY . .

EXPOSE 4000 35729

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--livereload", "--force_polling"]
