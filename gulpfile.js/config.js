var tmp = '.tmp';
var publicAssets = `${tmp}/build/assets`;
var sourceAssets  = './app/assets';
var nodeModules = './node_modules';

var config = {
  publicAssets: publicAssets,
  sourceAssets: sourceAssets,
};

// CLEAN
config.clean = {
  src: [
    `${tmp}/**`,
  ]
};

// IMAGES
config.images =  {
  src: [sourceAssets + '/images/**/*.{jpg,jpeg,png,gif,svg}', '!' + sourceAssets + '/images/**/sprite*/*.svg'],
  dest: publicAssets + '/images',
};

// STYLESHEETS
config.stylesheets =  {
  src: sourceAssets + '/stylesheets/**/*.scss',
  dest: publicAssets + '/stylesheets',
  sass: {
    includePaths: [nodeModules],
    outputStyle: 'compressed'
  },
  autoprefixer: {
    browsers: ['last 2 versions', 'ie >= 10']
  }
};

// JAVASCRIPTS
config.javascripts = {
  src: sourceAssets + '/javascripts/**/[^_]*.js',
  src_watch: sourceAssets + '/javascripts/**/*.js',
  dest: publicAssets + '/javascripts',
  include: {
    includePaths: [sourceAssets + '/javascripts', nodeModules],
  },
  minify: {
    ext: {
      min: '.js'
    }
  }
};

// FONTS
config.fonts = {
  src: sourceAssets + '/fonts/**/*.{svg,eot,ttf,woff,woff2}',
  dest: publicAssets + '/fonts',
};

// BROWSERSYNC
config.browsersync = {
  port: 3001,
  logSnippet: false,
  open: false,
  socket: {
    domain: 'localhost:3001'
  }
};

// DELIVER
var tmpDeliver = `${tmp}/deliver`;

config.deliver = {
  copy: {
    src_build: ['./build/**'],
    src_sources: './app/assets/**/*',
    dest_build: `${tmpDeliver}/build`,
    dest_sources: `${tmpDeliver}/sources`
  },
  zip: {
    prefix: 'livrable-',
    src: `${tmpDeliver}/**`,
    dest: './livrables'
  }
};

// Export
module.exports = config;
