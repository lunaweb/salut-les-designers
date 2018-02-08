# encoding: utf-8

module FrontHelpers

  def svg_tag(path, options= {})
    path = path.split('#')
    anchor = path[1] ? "##{path[1]}" : nil

    html = []

    if options[:title]
      html << content_tag(:title, options[:title])
      options.delete(:title)
    end

    html << tag(:use, "xlink:href" => "#{image_path(path.first)}#{anchor}")

    content_tag :svg, options do
      html.join.html_safe
    end
  end

  def svg_sprite(name, options = {})
    svg_tag "front/sprite.svg#sprite-#{name}", options
  end

  def ui_component(component, variables)
    old_within_component = @within_component
    begin
      @within_component = true
      partial("components/#{component}", :locals => variables.symbolize_keys)
    ensure
      @within_component = old_within_component
    end
  end

  def method_missing(method, *args)
    if @within_component
      nil
    else
      super
    end
  end

end