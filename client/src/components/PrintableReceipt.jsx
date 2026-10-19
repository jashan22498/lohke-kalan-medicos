import React from 'react';

export default function PrintableReceipt({ printData }) {
  if (!printData || !printData.bill) return null;
  const { bill, settings } = printData;

  return (
    <div id="printable-receipt" className="hidden font-mono text-black">
      {/* Store Header */}
      <div className="text-center border-b border-black pb-2 mb-2">
        <h2 className="text-base font-bold uppercase">{settings?.punjabiStoreName || settings?.storeName || 'LOHKE MEDICOS'}</h2>
        <h3 className="text-xs font-bold">{settings?.storeName || 'LOHKE MEDICOS & HEALTHCARE'}</h3>
        <p className="text-[10px] mt-0.5">{settings?.address || 'Lohke Kalan, Distt. Ferozepur, Punjab'}</p>
        <p className="text-[10px]">Ph: {settings?.phone || '9876543210'} | DL: {settings?.drugLicenseNo || 'PB-FZP-19842-DL'}</p>
        {settings?.gstin && <p className="text-[10px]">GSTIN: {settings.gstin}</p>}
      </div>

      {/* Bill Meta */}
      <div className="text-[11px] border-b border-black pb-2 mb-2 space-y-0.5">
        <div className="flex justify-between font-bold">
          <span>INVOICE #{bill.billNumber || bill.id}</span>
          <span>{new Date(bill.createdAt).toLocaleDateString('en-IN')} {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div>Customer: <span className="font-bold">{bill.customerName}</span></div>
        {bill.customerPhone && <div>Phone: {bill.customerPhone}</div>}
        <div>Village: {bill.customerVillage || 'Lohke Kalan'}</div>
        <div>Payment: <span className="font-bold uppercase">{bill.paymentMode}</span></div>
      </div>

      {/* Items Table */}
      <table className="w-full text-[10px] border-b border-black pb-2 mb-2">
        <thead>
          <tr className="border-b border-dashed border-black">
            <th className="text-left py-1">Item</th>
            <th className="text-left py-1">Batch</th>
            <th className="text-center py-1">Qty</th>
            <th className="text-right py-1">Rate</th>
            <th className="text-right py-1">Amt</th>
          </tr>
        </thead>
        <tbody>
          {bill.items?.map((item, idx) => (
            <tr key={idx}>
              <td className="py-0.5 pr-1 font-bold">{item.name}</td>
              <td className="py-0.5 pr-1">{item.batchNo || '-'}</td>
              <td className="py-0.5 text-center">{item.qty}</td>
              <td className="py-0.5 text-right">₹{item.unitPrice}</td>
              <td className="py-0.5 text-right font-bold">₹{item.total || (item.unitPrice * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="text-[11px] space-y-0.5 border-b border-black pb-2 mb-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>₹{bill.subtotal || bill.grandTotal}</span>
        </div>
        {bill.discount > 0 && (
          <div className="flex justify-between text-black">
            <span>Discount:</span>
            <span>- ₹{bill.discount}</span>
          </div>
        )}
        <div className="flex justify-between font-extrabold text-sm pt-1 border-t border-dashed border-black">
          <span>NET PAYABLE:</span>
          <span>₹{bill.grandTotal}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] space-y-1 mt-3">
        <p className="font-bold">ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ ਜੀ! ਧੰਨਵਾਦ!</p>
        <p>Wishing you speedy recovery & good health.</p>
        <p className="text-[9px] text-gray-600">Goods once sold will be replaced within 7 days with bill.</p>
        <div className="pt-4 flex justify-between items-end text-[9px]">
          <span>E. &amp; O.E.</span>
          <span className="border-t border-black pt-0.5">Authorised Pharmacist</span>
        </div>
      </div>
    </div>
  );
}
