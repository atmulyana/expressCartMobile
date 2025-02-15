require 'json'

package = JSON.parse(File.read(File.join(__dir__, '../node_modules/@builder.io/react-native-render-html/package.json')))

Pod::Spec.new do |s|
  #s.name         = package['name']
  s.name          = "react-native-render-html"
  s.version       = package['version']
  s.summary       = package['description']
  s.license       = package['license']

  s.authors       = package['author']
  s.homepage      = package['homepage']
  s.platform      = :ios, "9.0"

  s.source        = { :git => "https://github.com/meliorence/react-native-render-html.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m}"

  s.dependency 'React-Core'
end
