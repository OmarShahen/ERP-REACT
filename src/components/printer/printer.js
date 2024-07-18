import escpos from 'escpos';

// Set up the device, printer, and options (e.g., USB)
const device = new escpos.USB();
const options = { encoding: "GB18030" /* or whatever encoding your printer supports */ };
const printer = new escpos.Printer(device, options);

const printReceipt = (text) => {
  device.open(() => {
    printer
      .text(text)
      .cut()
      .close();
  });
};

export { printReceipt };