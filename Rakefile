
begin
  require 'jasmine'
  load 'jasmine/tasks/jasmine.rake'

  require 'jasmine/headless/task'
rescue LoadError
  task :jasmine do
    abort "Jasmine is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
  end
end

begin
  require 'jasmine/headless/task'
  Jasmine::Headless::Task.new('jasmine:headless') do |t|
    t.colors = true
      t.keep_on_error = true
        t.jasmine_config = 'spec/javascripts/support/jasmine.yml'
	end
rescue LoadError
  abort "Jasmine-headless-webkit is not available. In order to run jasmine, you must: (sudo) gem install jasmine"
end
