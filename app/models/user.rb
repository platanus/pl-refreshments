class User < ApplicationRecord
  validates :name, presence: true

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :user_products
  has_many :products, through: :user_products
  has_many :invoice_products, through: :user_products
  has_many :invoices, through: :invoice_products
  has_many :withdrawals

  def total_sales
    if user_ledger_lines.empty?
      0
    else
      -user_ledger_lines.where(accountable_type: 'InvoiceProduct')
                        .sum('ledger_lines.amount')
    end
  end

  def total_withdrawals
    withdrawals.where.not(aasm_state: :rejected).sum(:amount)
  end

  def total_pending_withdrawals
    withdrawals.where(aasm_state: :pending).sum(:amount)
  end

  def total_confirmed_withdrawals
    withdrawals.where(aasm_state: :confirmed).sum(:amount)
  end

  def withdrawable_amount
    if user_ledger_lines.empty?
      0
    else
      -user_ledger_lines.sorted.last.balance
    end
  end

  def user_ledger_lines
    user_ledger_account = LedgerAccount.find_by(accountable_id: id)
    LedgerLine.where(ledger_account_id: user_ledger_account&.id)
  end

  def products_with_sales
    user_products
      .joins(
        "LEFT OUTER JOIN (#{InvoiceProduct.settled.to_sql}) AS settled_invoice_products " \
        "ON settled_invoice_products.user_product_id = user_products.id"
      )
      .joins(:product)
      .group('user_products.id')
      .select(
        'user_products.*',
        'MAX(products.name) as product_name',
        'COUNT(settled_invoice_products.id) AS total_count',
        'COALESCE(SUM(settled_invoice_products.product_price), 0) AS total_satoshi'
      )
  end

  def available_funds
    LedgerAccount.find_or_create_by(category: 'available_funds', accountable: self)
  end

  def unconfirmed_withdrawal_funds
    LedgerAccount.find_or_create_by(category: 'unconfirmed_withdrawal_funds', accountable: self)
  end
end

# == Schema Information
#
# Table name: users
#
#  id                     :bigint(8)        not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  name                   :string           not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#
