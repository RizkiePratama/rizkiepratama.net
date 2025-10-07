require 'jekyll'
require 'mini_magick'
require 'fileutils'

module Jekyll
  class WebPGenerator < Generator
    safe true
    priority :low

    def generate(site)
      webp_dir = File.join(site.source, 'assets', 'images', 'webp')
      FileUtils.mkdir_p(webp_dir) unless File.directory?(webp_dir)

      site.static_files.each do |file|
        next if file.path.start_with?(webp_dir)

        if file.path.start_with?(File.join(site.source, 'assets', 'images')) &&
           ['.jpg', '.jpeg', '.png', '.webp'].include?(file.extname.downcase)

          relative_path = file.path.sub(File.join(site.source, 'assets', 'images'), '')
          adjusted_dirname = File.dirname(relative_path)
          if adjusted_dirname.start_with?('/post-thumbnails/source')
            adjusted_dirname = '/post-thumbnails'
          end

          webp_output_path = File.join(webp_dir, adjusted_dirname, File.basename(relative_path, '.*') + '.webp')

          FileUtils.mkdir_p(File.dirname(webp_output_path)) unless File.directory?(File.dirname(webp_output_path))

          if !File.exist?(webp_output_path) || File.mtime(file.path) > File.mtime(webp_output_path)
            puts "DEBUG: WebP output path: #{webp_output_path}"
            if file.extname.downcase == '.webp'
              puts "Copying existing WebP #{file.path} to #{webp_output_path}..."
              FileUtils.cp(file.path, webp_output_path)
            else
              puts "Converting #{file.path} to WebP..."
              begin
                img = MiniMagick::Image.open(file.path)
                img.format 'webp'
                img.write webp_output_path
                img.destroy! # Release memory
              rescue MiniMagick::Error => e
                warn "WebP conversion failed for #{file.path}: #{e.message}"
              rescue StandardError => e
                warn "An unexpected error occurred during WebP conversion for #{file.path}: #{e.message}"
              end
            end

            site.static_files << StaticFile.new(site, site.source, File.dirname(webp_output_path).sub(site.source, ''), File.basename(webp_output_path))
          end
        end
      end
    end
  end
end
