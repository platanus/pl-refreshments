ActiveAdmin.register UserProduct do
  permit_params :name, :price, :user_id, :active, :stock, :category, :image

  form partial: 'form'

  preserve_default_filters!
  filter :category, as: :check_boxes, collection: proc { UserProduct.categories }
  show do
    attributes_table do
      row :name
      row :user
      row :price
      row :active
      row :stock
      row :category
      row :image do |ad|
        image_tag url_for(ad.image) if ad.image.attached?
      end
    end
  end
end
