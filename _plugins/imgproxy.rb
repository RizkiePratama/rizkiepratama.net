module Jekyll
  module ImgproxyFilter
    def imgproxy(input, options = '')
      return input if input.nil? || input.empty?

      # Resolve the site configuration
      site = @context.registers[:site]
      imgproxy_url = site.config['imgproxy_url']

      # If imgproxy_url is not set or empty, fallback to local assets path
      if imgproxy_url.nil? || imgproxy_url.empty?
        # Make sure we start with a slash and have assets/images/
        path = input.sub(/^\//, '')
        unless path.start_with?('assets/images/')
          path = File.join('assets/images', path)
        end
        return "/#{path}"
      end

      # Normalize path: remove leading slash and 'assets/images/' prefix
      clean_path = input.sub(/^\//, '').sub(/^assets\/images\//, '')

      # Determine if we should append format extension like @webp
      # If the URL already ends with .svg, do not append @webp
      if clean_path.end_with?('.svg')
        format_suffix = ''
      else
        format_suffix = '@webp'
      end

      # Construct processing options. Default to no-op if empty.
      opts = options.to_s.strip
      if opts.empty?
        "#{imgproxy_url}/insecure/plain/local:///#{clean_path}#{format_suffix}"
      else
        "#{imgproxy_url}/insecure/#{opts}/plain/local:///#{clean_path}#{format_suffix}"
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::ImgproxyFilter)
