Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: 'upload_multiples#index'
  get 'upload_multiple', to: 'upload_multiples#index'
end
