###
# Page options, layouts, aliases and proxies
###

# Layout
page "/", :layout => "front"

# No layout
page '*.xml', layout: false
page '*.json', layout: false
page '*.txt', layout: false

# Ignore .md file in assets
ignore "assets/**/*.md"

###
# Dirs
###

# Source & build dir
set :source, "app"

# Assets dir
set :css_dir, "assets/stylesheets"
set :js_dir, "assets/javascripts"
set :images_dir, "assets/images"
set :fonts_dir, "assets/fonts"
set :data_dir, "data"

###
# Extensions
###

# Autoprefixer
activate :autoprefixer do |config|
  config.browsers = ['last 4 versions', 'Explorer >= 10']
end

# Deploy
activate :deploy do |config|
  branch_name = `git rev-parse --abbrev-ref HEAD`
  config.build_before  = false
  config.deploy_method = :rsync
  config.host          = 'lunaweb@preprod-03.lunaweb.io'
  config.path          = "/home/prototype/maaf-mars-app-2016/#{branch_name}"
  config.clean         = true
end

# Sprockets
activate :sprockets
sprockets.append_path File.join(root, "node_modules")

###
# Engines
###

# Slim
set :slim, { :pretty => true }

# Dato
activate :dato

ignore "/templates/*"

proxy "/episodes.html", "/templates/episodes/index.html"
dato.tap do |dato|
  dato.audios.each_with_index do |audio, i|
    prev_audio = dato.audios[i+1];
    proxy "/episodes/#{audio.permalink}.html", "/templates/episodes/view.html", locals: { audio: audio, prev_audio: prev_audio }
  end
end

###
# Environnement-specific confirgurations
###

# Development-specific configuration
# configure :development do
#   activate :livereload
# end

# Build-specific configuration
configure :build do
  activate :minify_css
  activate :minify_javascript
  set :slim, { :pretty => true }
end
