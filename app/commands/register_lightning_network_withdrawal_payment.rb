class RegisterLightningNetworkWithdrawalPayment < PowerTypes::Command.new(:lightning_withdrawal)
  PLATANUS_WALLET_ID = ENV.fetch('PLATANUS_WALLET_ID')

  def perform
    return unless @lightning_withdrawal.confirmed?

    Ledger::Transfer.for(
      from: lightning_account,
      to: debt_to_seller_account,
      countable: @lightning_withdrawal,
      amount: @lightning_withdrawal.amount,
      date: @lightning_withdrawal.created_at
    )
  end

  private

  def debt_to_seller_account
    LedgerAccount.find_or_create_by!(
      accountable: lightning_withdrawal_user,
      category: 'DebtToSellers'
    )
  end

  def lightning_account
    LedgerAccount.find_or_create_by!(
      accountable: Wallet.find(PLATANUS_WALLET_ID), # platanus node
      category: 'Wallet'
    )
  end

  def lightning_withdrawal_user
    @lightning_withdrawal_user ||= User.find(@lightning_withdrawal.user_id)
  end
end