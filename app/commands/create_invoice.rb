class CreateInvoice < PowerTypes::Command.new(:memo, :products_hash)
  def perform
    return if invoice_total_satoshis.zero?
    invoice_response = lightning_network_client.create_invoice(@memo, invoice_total_satoshis)
    Invoice.create!(
      satoshis: invoice_total_satoshis, clp: invoice_total_clp, memo: @memo,
      payment_request: invoice_response["payment_request"], r_hash: invoice_response["r_hash"]
    )
  end

  private

  def invoice_total_satoshis
    @invoice_total_satoshis ||= GetPriceOnSatoshis.for(clp_price: invoice_total_clp)
  end

  def invoice_total_clp
    @invoice_total_clp ||= begin
      @products_hash.map do |product_id, quantity|
        (prices_hash[product_id.to_i] || 0) * quantity
      end.inject(:+) || 0
    end
  end

  def prices_hash
    @prices_hash ||= Product.where(id: @products_hash.keys).pluck(:id, :price).to_h
  end

  def lightning_network_client
    @lightning_network_client ||= LightningNetworkClient.new
  end
end
