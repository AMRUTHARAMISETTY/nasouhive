import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MobileGlyph } from './mobile/MobileAppShell';

const defaultImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=640&q=80';

const methods = [
  {
    id: 'manual',
    icon: 'plus',
    title: 'Manual Entry',
    label: 'Flexible',
    cta: 'Start Manual Entry',
    description: 'Add products one by one with pricing, images, stock count, SKU and warehouse.',
    features: ['Best for small additions', 'Full product customization', 'Real-time validation'],
  },
  {
    id: 'excel',
    icon: 'upload',
    title: 'Bulk Excel Upload',
    label: 'Fastest',
    cta: 'Upload Spreadsheet',
    description: 'Import hundreds of products instantly using CSV, XLS or XLSX templates.',
    features: ['Download sample template', 'Drag and drop upload', 'AI column mapping', 'Error preview'],
  },
  {
    id: 'voice',
    icon: 'mic',
    title: 'Voice Inventory Input',
    label: 'AI Powered',
    cta: 'Start Voice Capture',
    description: 'Speak product details naturally and generate inventory rows automatically.',
    features: ['AI speech recognition', 'Multi-product detection', 'Auto category assignment'],
  },
];

const categoryOptions = ['Electronics', 'Home Living', 'Beauty', 'Fashion', 'Kitchen', 'Finished Goods', 'Raw Materials'];
const warehouseOptions = ['Front Store', 'Back Warehouse', 'WH-01 Bengaluru', 'WH-02 Hyderabad', 'Line C'];

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.16em] text-[#255849]/75">{label}</span>
      {children}
    </label>
  );
}

function WizardInput(props) {
  return (
    <input
      {...props}
      className={cn(
        'min-h-12 w-full rounded-2xl border border-[#D8D2C8] bg-white/75 px-4 text-sm font-semibold text-[#1F5C4A] outline-none transition placeholder:text-[#255849]/45 focus:border-[#1F5C4A] focus:shadow-[0_0_0_4px_rgba(31,92,74,0.12)]',
        props.className,
      )}
    />
  );
}

function MethodCard({ method, selected, onSelect, index }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(method.id)}
      className={cn(
        'group relative min-h-[318px] overflow-hidden rounded-[24px] border p-5 text-left shadow-[0_22px_60px_rgba(37,88,73,0.10)] backdrop-blur-2xl transition',
        selected ? 'border-[#1F5C4A] bg-white/92 shadow-[0_28px_80px_rgba(31,92,74,0.18)]' : 'border-white/70 bg-white/70 hover:border-[#1F5C4A]/35 hover:shadow-[0_26px_74px_rgba(31,92,74,0.15)]',
      )}
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(31,92,74,0.13),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.88),rgba(247,245,242,0.58))]" />
      <span className="relative flex items-start justify-between gap-3">
        <span className={cn('grid h-14 w-14 place-items-center rounded-[20px] text-[#1F5C4A] shadow-inner', selected ? 'bg-[#E6ECEA]' : 'bg-[#F7F5F2]')}>
          <motion.span
            animate={
              method.id === 'voice'
                ? { scale: [1, 1.11, 1], opacity: [1, 0.8, 1] }
                : method.id === 'excel'
                ? { y: [0, -2, 0] }
                : { rotate: selected ? [0, -8, 0] : 0 }
            }
            transition={{ duration: 1.4, repeat: method.id === 'manual' && !selected ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <MobileGlyph name={method.icon} className="h-7 w-7" />
          </motion.span>
        </span>
        <span className="rounded-full border border-[#1F5C4A]/10 bg-[#E6ECEA] px-3 py-1 text-xs font-black text-[#1F5C4A]">{method.label}</span>
      </span>
      <span className="relative mt-6 block">
        <span className="block text-xl font-black tracking-[-0.03em] text-[#1F5C4A]">{method.title}</span>
        <span className="mt-3 block text-sm leading-6 text-[#255849]">{method.description}</span>
      </span>
      <span className="relative mt-5 grid gap-2">
        {method.features.map((feature) => (
          <span key={feature} className="flex items-center gap-2 text-xs font-bold text-[#255849]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1F5C4A]" />
            {feature}
          </span>
        ))}
      </span>
      <span className="relative mt-6 inline-flex min-h-11 items-center rounded-2xl bg-[#1F5C4A] px-4 text-sm font-black text-white transition group-hover:bg-[#255849]">
        {method.cta} <span className="ml-2">-&gt;</span>
      </span>
    </motion.button>
  );
}

function PreviewTable({ rows }) {
  if (!rows.length) return null;

  return (
    <div className="overflow-hidden rounded-[18px] border border-[#D8D2C8] bg-white/82">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[#D8D2C8] px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-[#255849]/75">
        <span>Product</span>
        <span>SKU</span>
        <span>Qty</span>
      </div>
      {rows.map((row) => (
        <div key={row.sku} className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[#EFEAE1] px-4 py-3 text-sm last:border-b-0">
          <span className="min-w-0 font-bold text-[#1F5C4A]">{row.name}</span>
          <span className="font-semibold text-[#255849]">{row.sku}</span>
          <span className="font-semibold text-[#255849]">{row.stock ?? row.quantity}</span>
        </div>
      ))}
    </div>
  );
}

function AddStockWizard({
  open,
  onClose,
  onMethodSelect,
  onCreateRows,
  type = 'retailer',
  customTitle = 'Add New Inventory',
  customSubtitle = 'Choose how you want to create stock entries',
}) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [manualForm, setManualForm] = useState({
    name: '',
    sku: '',
    category: type === 'manufacturer' ? 'Finished Goods' : 'Electronics',
    location: type === 'manufacturer' ? 'WH-01 Bengaluru' : 'Front Store',
    price: '',
    stock: '',
    image: '',
  });
  const [excelFile, setExcelFile] = useState('');
  const [voiceText, setVoiceText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setSelectedMethod('');
      setExcelFile('');
      setVoiceText('');
      setIsRecording(false);
      setVoiceMessage('');
      setImagePreview('');
    }
  }, [open]);

  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedMethod]);

  const skuPrefix = type === 'manufacturer' ? 'MFG' : 'RT';

  const normalizeRow = (row, index = 1) => {
    if (type === 'manufacturer') {
      return {
        name: row.name,
        sku: row.sku || `${skuPrefix}-${Date.now().toString().slice(-4)}-${index}`,
        category: row.category || 'Finished Goods',
        quantity: row.quantity || `${row.stock || 1} units`,
        location: row.location || 'WH-01 Bengaluru',
        status: row.status || 'Healthy',
        source: row.source || 'Add stock wizard',
        image: row.image || defaultImage,
      };
    }

    const stock = Number(row.stock) || 1;
    return {
      name: row.name,
      sku: row.sku || `${skuPrefix}-${Date.now().toString().slice(-4)}-${index}`,
      category: row.category || 'Electronics',
      location: row.location || 'Front Store',
      price: row.price || '$0',
      stock,
      fill: Math.min(100, Math.max(8, stock)),
      status: row.status || (stock < 40 ? 'Low' : 'Healthy'),
      image: row.image || defaultImage,
    };
  };

  const manualPreview = useMemo(() => {
    if (!manualForm.name.trim() && !manualForm.stock.trim()) return [];
    return [
      normalizeRow({
        ...manualForm,
        sku: manualForm.sku || `${skuPrefix}-AUTO-001`,
        image: imagePreview || manualForm.image,
        source: 'Manual entry',
      }),
    ];
  }, [imagePreview, manualForm, skuPrefix]);

  const excelPreview = useMemo(() => {
    if (!excelFile) return [];
    return [
      normalizeRow({ name: 'Uploaded Shelf Product', sku: 'UPL-001', category: 'Electronics', location: 'Front Store', price: '$64', stock: 72, source: excelFile }, 1),
      normalizeRow({ name: 'Uploaded Reserve Stock', sku: 'UPL-002', category: 'Home Living', location: 'Back Warehouse', price: '$38', stock: 34, source: excelFile }, 2),
    ];
  }, [excelFile]);

  const voicePreview = useMemo(() => {
    if (!voiceText.trim()) return [];
    return voiceText
      .split(/,|\n/)
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry, index) => {
        const stock = Number(entry.match(/\d+/)?.[0] || 24);
        const name = entry.replace(/\s+\d+.*/, '').trim() || `Voice Product ${index + 1}`;
        return normalizeRow({
          name,
          sku: `VOICE-${String(index + 1).padStart(3, '0')}`,
          category: index % 2 === 0 ? 'Electronics' : 'Home Living',
          location: /warehouse|WH-/i.test(entry) ? (entry.match(/WH-\d+/i)?.[0]?.toUpperCase() || 'Back Warehouse') : 'Front Store',
          price: '$0',
          stock,
          source: 'Voice capture',
        }, index + 1);
      });
  }, [voiceText]);

  const activeRows = selectedMethod === 'manual' ? manualPreview : selectedMethod === 'excel' ? excelPreview : selectedMethod === 'voice' ? voicePreview : [];
  const duplicateSkus = activeRows.map((row) => row.sku).filter((sku, index, list) => list.indexOf(sku) !== index);
  const canCreate = activeRows.length > 0 && duplicateSkus.length === 0;

  const createRows = () => {
    if (!canCreate) return;
    onCreateRows?.(activeRows, selectedMethod);
    onMethodSelect?.(selectedMethod);
    onClose?.();
  };

  const handleFile = (file) => {
    if (!file) return;
    setExcelFile(file.name);
  };

  const attachImage = (file) => {
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const startVoice = () => {
    setSelectedMethod('voice');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceText((prev) => prev || 'Add 20 iPhone chargers to front store, add 36 desk lamps to back warehouse');
      setVoiceMessage('Speech recognition is unavailable here. Edit the sample transcript to generate your list.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onstart = () => {
      setIsRecording(true);
      setVoiceMessage('Listening for product names, quantities, and locations...');
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => {
      setIsRecording(false);
      setVoiceMessage('Voice capture stopped. Retry or type directly in the transcript.');
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((result) => result[0].transcript).join(' ');
      setVoiceText((prev) => [prev, transcript].filter(Boolean).join(', '));
      setVoiceMessage('Voice captured. Review the generated rows before adding them.');
    };

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
      setVoiceMessage('Voice capture is already active. Finish speaking and try again.');
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#1F5C4A]/28 px-3 py-5 backdrop-blur-md sm:px-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.section
            ref={modalRef}
            initial={{ opacity: 0, y: 38, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 32, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[20px] border border-white/70 bg-[#F7F5F2]/95 p-4 text-[#1F5C4A] shadow-[0_34px_100px_rgba(31,92,74,0.26)] backdrop-blur-2xl sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_18%_0%,rgba(31,92,74,0.13),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.34))]" />
            <div className="relative">
              <div className="flex flex-col gap-4 border-b border-[#D8D2C8] pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#255849]/70">Inventory Workflow</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1F5C4A] sm:text-3xl">
                    {selectedMethod ? methods.find((item) => item.id === selectedMethod)?.title : customTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#255849]">
                    {selectedMethod ? 'Complete the details below and review the generated inventory rows.' : customSubtitle}
                  </p>
                </div>
                <button type="button" onClick={onClose} aria-label="Close add inventory" title="Close" className="grid h-11 w-11 shrink-0 place-items-center self-end rounded-full border border-[#D8D2C8] bg-white/80 text-[#1F5C4A] sm:self-start">
                  <MobileGlyph name="close" className="h-5 w-5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {!selectedMethod ? (
                  <motion.div
                    key="method-selection"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    className="mt-6 grid gap-4 lg:grid-cols-3"
                  >
                    {methods.map((method, index) => (
                      <MethodCard key={method.id} method={method} index={index} selected={false} onSelect={method.id === 'voice' ? startVoice : setSelectedMethod} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={selectedMethod}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    className="mt-5 rounded-[20px] border border-[#D8D2C8] bg-white/70 p-4 shadow-[0_18px_50px_rgba(37,88,73,0.10)] sm:p-5"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#255849]/70">Add Inventory</p>
                        <h3 className="mt-1 text-base font-black text-[#1F5C4A]">Review and create stock</h3>
                      </div>
                      <button type="button" onClick={() => setSelectedMethod('')} className="rounded-xl border border-[#D8D2C8] bg-white/80 px-4 py-2 text-sm font-black text-[#1F5C4A]">
                        Change Method
                      </button>
                    </div>

                    {selectedMethod === 'manual' ? (
                      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Product Name"><WizardInput value={manualForm.name} onChange={(event) => setManualForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Aero Smart Kettle" /></Field>
                          <Field label="SKU"><WizardInput value={manualForm.sku} onChange={(event) => setManualForm((prev) => ({ ...prev, sku: event.target.value }))} placeholder={`${skuPrefix}-AUTO-001`} /></Field>
                          <Field label="Stock Count"><WizardInput type="number" min="0" value={manualForm.stock} onChange={(event) => setManualForm((prev) => ({ ...prev, stock: event.target.value }))} placeholder="48" /></Field>
                          <Field label="Price"><WizardInput value={manualForm.price} onChange={(event) => setManualForm((prev) => ({ ...prev, price: event.target.value }))} placeholder="$64" /></Field>
                          <Field label="Category">
                            <select value={manualForm.category} onChange={(event) => setManualForm((prev) => ({ ...prev, category: event.target.value }))} className="min-h-12 w-full rounded-2xl border border-[#D8D2C8] bg-white/75 px-4 text-sm font-semibold text-[#1F5C4A] outline-none">
                              {categoryOptions.map((option) => <option key={option}>{option}</option>)}
                            </select>
                          </Field>
                          <Field label="Warehouse">
                            <select value={manualForm.location} onChange={(event) => setManualForm((prev) => ({ ...prev, location: event.target.value }))} className="min-h-12 w-full rounded-2xl border border-[#D8D2C8] bg-white/75 px-4 text-sm font-semibold text-[#1F5C4A] outline-none">
                              {warehouseOptions.map((option) => <option key={option}>{option}</option>)}
                            </select>
                          </Field>
                          <label className="sm:col-span-2 rounded-[20px] border border-dashed border-[#D8D2C8] bg-[#F7F5F2]/75 p-4 text-sm font-bold text-[#1F5C4A]">
                            Image upload preview
                            <input type="file" accept="image/*" onChange={(event) => attachImage(event.target.files?.[0])} className="mt-3 block w-full text-sm" />
                          </label>
                        </div>
                        <div className="rounded-[20px] border border-[#D8D2C8] bg-[#F7F5F2] p-4">
                          <div className="aspect-[4/3] overflow-hidden rounded-[16px] bg-white">
                            {imagePreview ? <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-sm font-bold text-[#255849]/60">Image Preview</div>}
                          </div>
                          <div className="mt-4 grid gap-2">
                            <button type="button" onClick={() => setManualForm((prev) => ({ ...prev, sku: prev.sku || `${skuPrefix}-${Math.floor(1000 + Math.random() * 9000)}` }))} className="rounded-2xl bg-[#E6ECEA] px-4 py-3 text-sm font-black text-[#1F5C4A]">Generate SKU</button>
                            <button type="button" className="rounded-2xl border border-[#D8D2C8] bg-white px-4 py-3 text-sm font-black text-[#1F5C4A]">Scan Barcode</button>
                            <button type="button" onClick={() => setManualForm((prev) => ({ ...prev, category: 'Electronics' }))} className="rounded-2xl border border-[#D8D2C8] bg-white px-4 py-3 text-sm font-black text-[#1F5C4A]">Suggest Category</button>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {selectedMethod === 'excel' ? (
                      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                        <label
                          onDragOver={(event) => event.preventDefault()}
                          onDrop={(event) => {
                            event.preventDefault();
                            handleFile(event.dataTransfer.files?.[0]);
                          }}
                          className="grid min-h-[220px] cursor-pointer place-items-center rounded-[22px] border border-dashed border-[#1F5C4A]/35 bg-[#F7F5F2]/82 p-6 text-center transition hover:border-[#1F5C4A] hover:shadow-[0_0_0_6px_rgba(31,92,74,0.08)]"
                        >
                          <input type="file" accept=".csv,.xls,.xlsx" onChange={(event) => handleFile(event.target.files?.[0])} className="sr-only" />
                          <span>
                            <span className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] bg-[#E6ECEA] text-[#1F5C4A]"><MobileGlyph name="upload" className="h-7 w-7" /></span>
                            <span className="mt-4 block text-lg font-black text-[#1F5C4A]">{excelFile || 'Drag and drop spreadsheet'}</span>
                            <span className="mt-2 block text-sm leading-6 text-[#255849]">CSV, XLS or XLSX with AI column mapping and row preview.</span>
                          </span>
                        </label>
                        <div className="grid gap-3">
                          <a href="data:text/csv;charset=utf-8,sku,name,category,stock,location,price%0ART-001,Sample Product,Electronics,50,Front Store,$49" download="nasou-stock-template.csv" className="rounded-2xl bg-[#1F5C4A] px-4 py-3 text-center text-sm font-black text-white">Download Template</a>
                          <div className="rounded-[20px] border border-[#D8D2C8] bg-white/75 p-4">
                            <p className="text-sm font-black text-[#1F5C4A]">Validation</p>
                            <div className="mt-3 grid gap-2 text-sm font-semibold text-[#255849]">
                              <span>Column mapping ready</span>
                              <span>Duplicate SKU check {duplicateSkus.length ? 'needs review' : 'passed'}</span>
                              <span>{excelFile ? '2 preview rows detected' : 'Waiting for upload'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {selectedMethod === 'voice' ? (
                      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
                        <div className="rounded-[22px] border border-[#D8D2C8] bg-[#F7F5F2]/82 p-5 text-center">
                          <button type="button" onClick={startVoice} className={cn('mx-auto grid h-24 w-24 place-items-center rounded-full text-white shadow-[0_24px_52px_rgba(31,92,74,0.24)]', isRecording ? 'bg-[#255849]' : 'bg-[#1F5C4A]')}>
                            {isRecording ? <span className="absolute h-24 w-24 animate-ping rounded-full bg-[#1F5C4A]/30" /> : null}
                            <MobileGlyph name="mic" className="relative h-10 w-10" />
                          </button>
                          <p className="mt-5 text-lg font-black text-[#1F5C4A]">{isRecording ? 'Listening...' : 'Ready to Capture'}</p>
                          <p className="mt-2 text-sm leading-6 text-[#255849]">Try: Add 20 iPhone chargers to front store.</p>
                          {voiceMessage ? <p className="mt-3 text-xs font-semibold leading-5 text-[#255849]">{voiceMessage}</p> : null}
                        </div>
                        <Field label="Live Transcript">
                          <textarea value={voiceText} onChange={(event) => setVoiceText(event.target.value)} rows={7} placeholder="Speak or type inventory details..." className="w-full rounded-[20px] border border-[#D8D2C8] bg-white/75 px-4 py-3 text-sm font-semibold leading-6 text-[#1F5C4A] outline-none placeholder:text-[#255849]/45 focus:border-[#1F5C4A] focus:shadow-[0_0_0_4px_rgba(31,92,74,0.12)]" />
                        </Field>
                      </div>
                    ) : null}

                    <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_260px]">
                      <PreviewTable rows={activeRows} />
                      <div className="rounded-[20px] border border-[#D8D2C8] bg-[#F7F5F2]/82 p-4">
                        <p className="text-sm font-black text-[#1F5C4A]">Create Stock</p>
                        <p className="mt-2 text-sm leading-6 text-[#255849]">{activeRows.length || 0} row{activeRows.length === 1 ? '' : 's'} ready for preview import.</p>
                        {duplicateSkus.length ? <p className="mt-2 text-sm font-bold text-rose-600">Duplicate SKU detected. Fix before creating.</p> : null}
                        <button type="button" disabled={!canCreate} onClick={createRows} className={cn('mt-4 w-full rounded-2xl px-4 py-3 text-sm font-black transition', canCreate ? 'bg-[#1F5C4A] text-white hover:bg-[#255849]' : 'cursor-not-allowed bg-[#D8D2C8] text-[#255849]/60')}>
                          Create Stock
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default AddStockWizard;
