source 'https://rubygems.org'

gem 'aasm'
gem 'active_model_serializers', '~> 0.9.3'
gem 'active_skin'
gem 'active_storage_validations'
gem 'activeadmin', '~> 2.1'
gem 'activeadmin_addons'
gem "aws-sdk-s3"
gem 'bootstrap'
gem 'coffee-rails', '~> 4.2'
gem 'data_migrate'
gem 'devise'
gem 'devise-i18n'
gem 'enumerize'
gem 'httparty'
gem 'jbuilder', '~> 2.5'
gem 'jquery-rails'
gem 'mini_magick'
gem 'pg'
gem 'power-types'
gem 'puma', '~> 4.3'
gem 'rack-cors', '~> 0.4.0'
gem 'rails', '~> 5.2'
gem 'rails-i18n'
gem 'recipient_interceptor'
gem 'responders'
gem 'sass-rails', '~> 5.0'
gem 'send_grid_mailer'
gem 'sentry-raven'
gem 'sidekiq'
gem 'sidekiq-scheduler'
gem 'simple_token_authentication', '~> 1.0'
gem 'slack-ruby-client'
gem 'spring'
gem 'turbolinks', '~> 5'
gem 'uglifier', '>= 1.3.0'
gem 'versionist'
gem 'webpacker', '~> 3.5'

group :production do
  gem 'heroku-stage'
  gem 'rack-timeout'
  gem 'rails_stdout_logging'
end

group :test do
  gem 'rails-controller-testing'
  gem 'rspec-collection_matchers'
  gem 'rspec_junit_formatter', '0.2.2'
  gem 'shoulda-matchers', require: false
end

group :development do
  gem 'annotate'
  gem 'table_print'
end

group :development, :test do
  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'dotenv-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'guard-rspec', require: false
  gem 'pry-byebug'
  gem 'pry-rails'
  gem 'rspec-nc', require: false
  gem 'rspec-rails'
end

group :production, :development, :test do
  gem 'tzinfo-data'
end
