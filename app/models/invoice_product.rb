class InvoiceProduct < ApplicationRecord
  validates :product_price, presence: true

  belongs_to :user_product
  belongs_to :invoice

  scope :settled, -> { joins(:invoice).merge(Invoice.settled) }

  before_validation { fix_product_price }

  def fix_product_price
    return if user_product.nil? || invoice.nil?

    self.product_price = product_price_initial_calc
  end

  private

  def product_price_initial_calc
    user_product.price * invoice.satoshi_clp_ratio
  end
end

# == Schema Information
#
# Table name: invoice_products
#
#  id              :bigint(8)        not null, primary key
#  invoice_id      :bigint(8)        not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  product_price   :integer          not null
#  user_product_id :bigint(8)
#
# Indexes
#
#  index_invoice_products_on_invoice_id       (invoice_id)
#  index_invoice_products_on_user_product_id  (user_product_id)
#
