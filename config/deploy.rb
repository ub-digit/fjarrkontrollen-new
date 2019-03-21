# config valid only for current version of Capistrano
lock '3.4.1'

# Set the application name
set :application, 'fjarrkontrollen'

# Set the repository link
set :repo_url, 'https://github.com/ub-digit/fjarrkontrollen.git'

# Set tmp directory on remote host - Default value: '/tmp , which often will not allow files to be executed
set :tmp_dir, '/home/apps/tmp'

# Copy originals into /{app}/shared/config from respective sample file
set :linked_files, %w{config/database.yml config/initializers/illbackend_cfg.rb config/initializers/secret_token.rb}

set :rvm_ruby_version, '2.3.1'      # Defaults to: 'default'

# Returns config for current stage assigned in config/deploy.yml
def deploy_config
  @config ||= YAML.load_file("config/deploy.yml")
  stage = fetch(:stage)
  return @config[stage.to_s]
end

server deploy_config['host'], port: deploy_config['port'], user: deploy_config['user'], roles: ['app', 'db', 'web']

set :deploy_to, deploy_config['path']

set :branch, ENV['branch'] || 'master'

set :default_env, {
    "PATH" => deploy_config['nvm_path'] + ":$PATH"
}
