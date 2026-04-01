require 'bibtex'
require 'json'

Jekyll::Hooks.register :site, :post_write do |site|
  bib_path = File.join(site.source, '_bibliography', 'references.bib')
  next unless File.exist?(bib_path)

  bib = BibTeX.open(bib_path)
  refs = {}

  bib.each do |entry|
    next unless entry.respond_to?(:key)

    authors = if entry[:author]
      entry[:author].to_s
    else
      ""
    end

    refs[entry.key.to_s] = {
      title: entry[:title].to_s.gsub(/[{}]/, ''),
      authors: authors.gsub(/[{}]/, ''),
      year: (entry[:year] || entry[:date] || "").to_s.gsub(/[{}]/, '')[0..3],
      url: (entry[:url] || "").to_s,
      doi: (entry[:doi] || "").to_s,
      journal: (entry[:journaltitle] || entry[:journal] || entry[:booktitle] || "").to_s.gsub(/[{}]/, ''),
      abstract: (entry[:abstract] || "").to_s.gsub(/[{}]/, ''),
      note: (entry[:note] || "").to_s.gsub(/[{}]/, '')
    }
  end

  output_path = File.join(site.dest, 'references.json')
  File.write(output_path, JSON.pretty_generate(refs))
end
