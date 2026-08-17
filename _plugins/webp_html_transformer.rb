require 'jekyll'
require 'nokogiri'

module Jekyll
  module WebPHTMLTransformer
    def self.process_images(page)
      # Only process HTML pages/documents
      return unless page.output_ext == '.html'

      doc = Nokogiri::HTML.parse(page.output)
      imgproxy_url = page.site.config['imgproxy_url']
      use_imgproxy = imgproxy_url && !imgproxy_url.empty?
      modified = false

      doc.css('img').each do |img_tag|
        original_src = img_tag['src']
        
        next if original_src.nil? || original_src.empty? || original_src.start_with?('data:') || original_src.end_with?('.svg')
        next if img_tag.ancestors('picture').any?

        if original_src.start_with?('/assets/images/')
          clean_path = original_src.sub(/^\//, '').sub(/^assets\/images\//, '')
          
          if use_imgproxy && original_src =~ /\.(jpg|jpeg|png)$/i
            # Route to imgproxy (resize to max 1200px for post body content, convert to webp)
            img_tag['src'] = "#{imgproxy_url}/insecure/rs:fit:1200:1200/plain/#{clean_path}@webp"
            modified = true
          else
            # Fallback to original local WebP conversion logic if the file exists in destination
            webp_src = original_src.sub('/assets/images/', '/assets/images/webp/')
            webp_src = webp_src.sub(/\.(jpg|jpeg|png)$/i, '.webp')

            root_site_dest_path = page.site.config['destination']
            relative_webp_path = webp_src.sub(/^\//, '')
            full_webp_path = File.join(root_site_dest_path, relative_webp_path)

            if File.exist?(full_webp_path)
              picture_tag = Nokogiri::XML::Node.new('picture', doc)

              source_tag = Nokogiri::XML::Node.new('source', doc)
              source_tag['srcset'] = webp_src
              source_tag['type'] = 'image/webp'
              picture_tag.add_child(source_tag)

              new_img_tag = Nokogiri::XML::Node.new('img', doc)
              img_tag.attributes.each do |name, attr|
                new_img_tag[name] = attr.value
              end
              picture_tag.add_child(new_img_tag)

              parent_node = img_tag.parent
              if parent_node && parent_node.name == 'p' && parent_node.children.all? { |child| child == img_tag || (child.text? && child.text.strip.empty?) || (child.element? && child.name == 'br') }
                parent_node.replace(picture_tag)
              else
                img_tag.replace(picture_tag)
              end
              modified = true
            end
          end
        end
      end

      page.output = doc.to_html if modified
    end

    Jekyll::Hooks.register :pages, :post_render do |page|
      WebPHTMLTransformer.process_images(page)
    end

    Jekyll::Hooks.register :documents, :post_render do |document|
      WebPHTMLTransformer.process_images(document)
    end
  end
end
