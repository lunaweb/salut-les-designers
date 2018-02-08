guard :livereload do
  # Views
  watch(%r{app/.+\.(erb|haml|slim)$})
  # Assets
  watch(%r{(app|vendor)(/assets/\w+/(.+\.(css|js|gif|png|jpe?g|svg))).*}) { |m| "/assets/#{m[3]}" }
  watch(%r{(app|vendor)(/assets/\w+/(.+)\.(scss))}) { |m| "/assets/#{m[3]}.css" }
  watch(%r{(app|vendor)(/assets/\w+/(.+)\.(jsx))}) { |m| "/assets/#{m[3]}.js" }
end