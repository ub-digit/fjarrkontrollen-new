class ConfigsController < ApplicationController
  def index
     render json: {configs: [{id: "1", koha_search_url: Illbackend::Application.config.koha[:search_url], librisill_request_url: Illbackend::Application.config.librisill_settings[:request_url]}]}, status: 200
  end
end

