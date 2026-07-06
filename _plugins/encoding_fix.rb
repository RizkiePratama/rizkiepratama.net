# Cloudflare Pages' build container doesn't set a UTF-8 locale (LANG/LC_ALL),
# so Ruby defaults to US-ASCII external encoding and chokes on multi-byte
# translated content (e.g. _i18n/jp/**) with "invalid byte sequence in US-ASCII".
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8
