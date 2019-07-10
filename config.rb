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

# External pipeline
activate :external_pipeline,
  name: :gulp,
  command: "gulp #{build? ? "build" : "" }",
  source: ".tmp/build",
  latency: 0

###
# Extensions
###


###
# Engines
###

# Slim
set :slim, { :pretty => false }

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
  # Prevent Middleman from trying to compile Sass files since there are compiled in .tmp/build
  ignore "assets/**/*.scss"

  activate :asset_hash
end
