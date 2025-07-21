/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Combobox } from "@headlessui/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { EditProductModal } from "@/components/EditProductModal";
import { MotionButton } from "@/components/button";
import {
  Plus,
  Camera as CameraIcon,
  ChevronsUpDown,
  Trash2,
  Edit2,
  X,
} from "lucide-react";

// Dynamically import so it only runs client‑side
const BarcodeScanner = dynamic(
  () => import("react-qr-barcode-scanner"),
  { ssr: false }
);

// --- Types ---
interface Category { id: number; name: string }
interface Supplier { id: number; name: string }
interface Location { id: number; name: string }
interface Shelf { id: number; name: string }

type Product = {
  id: number;
  barcode: string;
  name: string;
  description?: string;
  categories: Category[];
  defaultSupplier?: Supplier;
  defaultLocation?: Location;
  defaultShelf?: Shelf;
};

type EditPayload = {
  id: number;
  barcode: string;
  name: string;
  description?: string;
  categoryIds: number[];
  supplierId?: number;
  locationId?: number;
  shelfId?: number;
};

// --- Camera Scanner Modal ---
function CameraBarcodeScanner({
  onDetected,
  onClose,
}: {
  onDetected: (code: string) => void;
  onClose: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-gray-800 rounded-xl shadow-2xl p-4 max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-white text-lg font-bold">
          <CameraIcon size={22} /> Scan Barcode
        </div>

        <div className="w-full overflow-hidden rounded-lg bg-black">
          <BarcodeScanner
            width={320}
            height={240}
            delay={300}
            onError={(err) => {
              const msg = typeof err === "string" ? err : err?.message;
              setError(msg || "Camera error");
            }}
            onUpdate={(err, result) => {
              if (err) setError("No code detected");
              else if (result) onDetected(result.getText());
            }}
          />
        </div>

        {error && (
          <p className="mt-2 text-rose-500 text-xs text-center">{error}</p>
        )}
        <p className="mt-2 text-xs text-gray-400 text-center">
          Point your camera at a barcode or QR code.<br />
          Tap outside or “X” to close.
        </p>
      </div>
    </div>
  );
}

export default function ProductAdminPage() {
  // master lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers]   = useState<Supplier[]>([]);
  const [locations, setLocations]   = useState<Location[]>([]);
  const [shelves,   setShelves]     = useState<Shelf[]>([]);
  const [products,  setProducts]    = useState<Product[]>([]);

  // filter states
  const [catSearch,  setCatSearch]  = useState("");
  const [supSearch,  setSupSearch]  = useState("");
  const [locSearch,  setLocSearch]  = useState("");
  const [shSearch,   setShSearch]   = useState("");
  const [prodSearch, setProdSearch] = useState("");

  // new-list inputs
  const [newCategory, setNewCategory] = useState("");
  const [newSupplier, setNewSupplier] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newShelf,    setNewShelf]    = useState("");

  // new-product form
  const [newProdBarcode,  setNewProdBarcode]  = useState("");
  const [newProdName,     setNewProdName]     = useState("");
  const [newProdDesc,     setNewProdDesc]     = useState("");
  const [newProdCats,     setNewProdCats]     = useState<Category[]>([]);
  const [newProdSupplier, setNewProdSupplier] = useState<Supplier | null>(null);
  const [newProdLocation, setNewProdLocation] = useState<Location | null>(null);
  const [newProdShelf,    setNewProdShelf]    = useState<Shelf | null>(null);

  // scanner & modals
  const [scannerOpen, setScannerOpen] = useState(false);
  const barcodeRef = useRef<HTMLInputElement>(null);
  const [editing,  setEditing]  = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // on mount: load all lists & products
  useEffect(() => {
    Promise.all([
      fetch("/api/categories").then(r=>r.json()),
      fetch("/api/suppliers").then(r=>r.json()),
      fetch("/api/locations").then(r=>r.json()),
      fetch("/api/shelves").then(r=>r.json()),
      fetch("/api/products").then(r=>r.json()),
    ]).then(([cats, sups, locs, shs, prods]) => {
      setCategories(cats);
      setSuppliers(sups);
      setLocations(locs);
      setShelves(shs);
      setProducts(prods);
    }).catch(() => toast.error("Failed to load data"));
  }, []);

  // filtered views
  const filteredCats  = catSearch  ? categories.filter(c => c.name.toLowerCase().includes(catSearch.toLowerCase())) : categories;
  const filteredSups  = supSearch  ? suppliers.filter(s => s.name.toLowerCase().includes(supSearch.toLowerCase())) : suppliers;
  const filteredLocs  = locSearch  ? locations.filter(l => l.name.toLowerCase().includes(locSearch.toLowerCase())) : locations;
  const filteredShs   = shSearch   ? shelves.filter(sh=> sh.name.toLowerCase().includes(shSearch.toLowerCase())) : shelves;
  const filteredProds = prodSearch ? products.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.barcode.includes(prodSearch)) : products;

  // helper to add to any list
  async function addToList<T extends {name:string}>(path:string,name:string, setter:(arr:T[])=>void){
    if(!name.trim()) return;
    const res = await fetch(`/api/${path}`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({name:name.trim()})
    });
    if(!res.ok){ toast.error("Failed to add"); return; }
    const obj = await res.json();
    setter(arr=>[...arr,obj]);
    toast.success(`${path.slice(0,-1)} added`);
  }

  // create product
  async function createProduct(){
    if(!newProdBarcode||!newProdName){ toast.error("Barcode & Name required"); return; }
    const body: any = {
      barcode: newProdBarcode,
      name: newProdName,
      description: newProdDesc||undefined,
      categoryIds: newProdCats.map(c=>c.id),
      supplierId: newProdSupplier?.id,
      locationId: newProdLocation?.id,
      shelfId:    newProdShelf?.id,
    };
    const res = await fetch("/api/products", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(body),
    });
    if(!res.ok){ toast.error("Failed to create"); return; }
    const prod = await res.json();
    setProducts(p=>[prod,...p]);
    toast.success("Product created");
    // reset form
    setNewProdBarcode(""); setNewProdName(""); setNewProdDesc("");
    setNewProdCats([]); setNewProdSupplier(null); setNewProdLocation(null); setNewProdShelf(null);
    barcodeRef.current?.focus();
  }

  // delete product
  async function deleteProduct(id:number){
    if(!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`,{method:"DELETE"});
    if(res.ok){
      setProducts(p=>p.filter(x=>x.id!==id));
      toast.success("Deleted");
    } else toast.error("Delete failed");
  }

  // save edits
  async function saveProduct(data:EditPayload){
    const res = await fetch(`/api/products/${data.id}`,{
      method:"PATCH", headers:{"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    if(!res.ok){ toast.error("Update failed"); return; }
    const updated = await res.json();
    setProducts(list=>list.map(x=>x.id===updated.id?updated:x));
    toast.success("Updated");
  }

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-white">Product Administration</h1>

        {/* === Manage Static Lists === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/** Categories **/}
          <section className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-white mb-2">Categories</h2>
            <input
              value={newCategory}
              onChange={e=>setNewCategory(e.target.value)}
              placeholder="Add category…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white"
            />
            <MotionButton
              onClick={()=>addToList("categories",newCategory,setCategories)}
              className="w-full mb-4"
            ><Plus size={12}/> Add</MotionButton>
            <input
              value={catSearch}
              onChange={e=>setCatSearch(e.target.value)}
              placeholder="Filter…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white text-sm"
            />
            <ul className="max-h-32 overflow-auto text-gray-300 space-y-1">
              {filteredCats.map(c=><li key={c.id}>{c.name}</li>)}
            </ul>
          </section>

          {/** Suppliers **/}
          <section className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-white mb-2">Suppliers</h2>
            <input
              value={newSupplier}
              onChange={e=>setNewSupplier(e.target.value)}
              placeholder="Add supplier…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white"
            />
            <MotionButton
              onClick={()=>addToList("suppliers",newSupplier,setSuppliers)}
              className="w-full mb-4"
            ><Plus size={12}/> Add</MotionButton>
            <input
              value={supSearch}
              onChange={e=>setSupSearch(e.target.value)}
              placeholder="Filter…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white text-sm"
            />
            <ul className="max-h-32 overflow-auto text-gray-300 space-y-1">
              {filteredSups.map(s=><li key={s.id}>{s.name}</li>)}
            </ul>
          </section>

          {/** Locations **/}
          <section className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-white mb-2">Locations</h2>
            <input
              value={newLocation}
              onChange={e=>setNewLocation(e.target.value)}
              placeholder="Add location…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white"
            />
            <MotionButton
              onClick={()=>addToList("locations",newLocation,setLocations)}
              className="w-full mb-4"
            ><Plus size={12}/> Add</MotionButton>
            <input
              value={locSearch}
              onChange={e=>setLocSearch(e.target.value)}
              placeholder="Filter…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white text-sm"
            />
            <ul className="max-h-32 overflow-auto text-gray-300 space-y-1">
              {filteredLocs.map(l=><li key={l.id}>{l.name}</li>)}
            </ul>
          </section>

          {/** Shelves **/}
          <section className="bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-white mb-2">Shelves</h2>
            <input
              value={newShelf}
              onChange={e=>setNewShelf(e.target.value)}
              placeholder="Add shelf…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white"
            />
            <MotionButton
              onClick={()=>addToList("shelves",newShelf,setShelves)}
              className="w-full mb-4"
            ><Plus size={12}/> Add</MotionButton>
            <input
              value={shSearch}
              onChange={e=>setShSearch(e.target.value)}
              placeholder="Filter…"
              className="w-full mb-2 p-2 bg-gray-700 rounded text-white text-sm"
            />
            <ul className="max-h-32 overflow-auto text-gray-300 space-y-1">
              {filteredShs.map(sh=><li key={sh.id}>{sh.name}</li>)}
            </ul>
          </section>
        </div>

        {/* === Add New Product === */}
        <section className="bg-gray-800 shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Add New Product</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Barcode */}
            <div>
              <label className="block text-gray-300 mb-1">Barcode</label>
              <div className="flex">
                <input
                  ref={barcodeRef}
                  value={newProdBarcode}
                  onChange={e=>setNewProdBarcode(e.target.value)}
                  placeholder="Scan or type…"
                  className="flex-1 p-2 bg-gray-700 rounded-l-lg text-white"
                />
                <button
                  onClick={()=>setScannerOpen(true)}
                  className="px-3 bg-gray-700 rounded-r-lg"
                >
                  <CameraIcon size={18} className="text-white"/>
                </button>
              </div>
            </div>
            {/* Name */}
            <div>
              <label className="block text-gray-300 mb-1">Name</label>
              <input
                value={newProdName}
                onChange={e=>setNewProdName(e.target.value)}
                placeholder="Product name"
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
            </div>
            {/* Description */}
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <input
                value={newProdDesc}
                onChange={e=>setNewProdDesc(e.target.value)}
                placeholder="Optional description"
                className="w-full p-2 bg-gray-700 rounded text-white"
              />
            </div>

            {/* Categories */}
            <div className="md:col-span-3">
              <label className="block text-gray-300 mb-1">Categories</label>
              <Combobox value={newProdCats} onChange={setNewProdCats} multiple>
                <div className="relative">
                  <Combobox.Input
                    displayValue={(cats:Category[])=>cats.map(c=>c.name).join(", ")}
                    placeholder="Select categories…"
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                  <Combobox.Button className="absolute right-2 top-2">
                    <ChevronsUpDown className="text-white"/>
                  </Combobox.Button>
                  <Combobox.Options className="absolute w-full mt-1 bg-gray-700 rounded max-h-48 overflow-auto">
                    {categories.map(c=>(
                      <Combobox.Option
                        key={c.id}
                        value={c}
                        className={({active})=>
                          active?"bg-green-600 text-white":"text-white"
                        }
                      >{c.name}</Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
            </div>

            {/* Default Supplier */}
            <div>
              <label className="block text-gray-300 mb-1">Default Supplier</label>
              <Combobox value={newProdSupplier} onChange={setNewProdSupplier} nullable>
                <div className="relative">
                  <Combobox.Input
                    displayValue={(s:Supplier)=>s?.name||""}
                    placeholder="Select supplier…"
                    readOnly
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                  <Combobox.Button className="absolute right-2 top-2">
                    <ChevronsUpDown className="text-white"/>
                  </Combobox.Button>
                  <Combobox.Options className="absolute w-full mt-1 bg-gray-700 rounded max-h-48 overflow-auto">
                    {suppliers.map(s=>(
                      <Combobox.Option
                        key={s.id}
                        value={s}
                        className={({active})=>
                          active?"bg-green-600 text-white":"text-white"
                        }
                      >{s.name}</Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
            </div>

            {/* Default Location */}
            <div>
              <label className="block text-gray-300 mb-1">Default Location</label>
              <Combobox value={newProdLocation} onChange={setNewProdLocation} nullable>
                <div className="relative">
                  <Combobox.Input
                    displayValue={(l:Location)=>l?.name||""}
                    placeholder="Select location…"
                    readOnly
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                  <Combobox.Button className="absolute right-2 top-2">
                    <ChevronsUpDown className="text-white"/>
                  </Combobox.Button>
                  <Combobox.Options className="absolute w-full mt-1 bg-gray-700 rounded max-h-48 overflow-auto">
                    {locations.map(l=>(
                      <Combobox.Option
                        key={l.id}
                        value={l}
                        className={({active})=>
                          active?"bg-green-600 text-white":"text-white"
                        }
                      >{l.name}</Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
            </div>

            {/* Default Shelf */}
            <div>
              <label className="block text-gray-300 mb-1">Default Shelf</label>
              <Combobox value={newProdShelf} onChange={setNewProdShelf} nullable>
                <div className="relative">
                  <Combobox.Input
                    displayValue={(sh:Shelf)=>sh?.name||""}
                    placeholder="Select shelf…"
                    readOnly
                    className="w-full p-2 bg-gray-700 rounded text-white"
                  />
                  <Combobox.Button className="absolute right-2 top-2">
                    <ChevronsUpDown className="text-white"/>
                  </Combobox.Button>
                  <Combobox.Options className="absolute w-full mt-1 bg-gray-700 rounded max-h-48 overflow-auto">
                    {shelves.map(sh=>(
                      <Combobox.Option
                        key={sh.id}
                        value={sh}
                        className={({active})=>
                          active?"bg-green-600 text-white":"text-white"
                        }
                      >{sh.name}</Combobox.Option>
                    ))}
                  </Combobox.Options>
                </div>
            </div>

            {/* Create */}
            <div className="md:col-span-3 flex justify-end mt-4">
              <MotionButton onClick={createProduct} className="bg-blue-600 px-6 py-2 rounded text-white">
                <Plus size={16}/> Create Product
              </MotionButton>
            </div>
          </div>
        </section>

        {/* === Product Table === */}
        <section className="space-y-4">
          <input
            value={prodSearch}
            onChange={e=>setProdSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full p-2 bg-gray-800 rounded text-white"
          />
          <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow">
            <table className="min-w-full text-sm text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  {[
                    "Barcode",
                    "Name",
                    "Description",
                    "Categories",
                    "Supplier",
                    "Location",
                    "Shelf",
                    "Actions",
                  ].map(h=>(
                    <th key={h} className="p-2 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProds.map(p=>(
                  <tr key={p.id} className="border-b hover:bg-gray-700">
                    <td className="p-2">{p.barcode}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.description||"—"}</td>
                    <td className="p-2">{p.categories.map(c=>c.name).join(", ")}</td>
                    <td className="p-2">{p.defaultSupplier?.name||"—"}</td>
                    <td className="p-2">{p.defaultLocation?.name||"—"}</td>
                    <td className="p-2">{p.defaultShelf?.name||"—"}</td>
                    <td className="p-2 flex gap-2">
                      <button onClick={()=>deleteProduct(p.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 size={16}/>
                      </button>
                      <button onClick={()=>{
                        setEditing(p); setEditOpen(true);
                      }} className="text-blue-500 hover:text-blue-600">
                        <Edit2 size={16}/>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProds.length===0 && (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-400">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Scanner Modal */}
        {scannerOpen && (
          <CameraBarcodeScanner
            onDetected={code=>{
              setNewProdBarcode(code);
              setScannerOpen(false);
              barcodeRef.current?.focus();
            }}
            onClose={()=>setScannerOpen(false)}
          />
        )}

        {/* Edit Modal */}
        {editing && (
          <EditProductModal
            isOpen={editOpen}
            onClose={()=>setEditOpen(false)}
            product={{
              id: editing.id,
              barcode: editing.barcode,
              name: editing.name,
              description: editing.description,
              categoryIds: editing.categories.map(c=>c.id),
              supplierId: editing.defaultSupplier?.id,
              locationId: editing.defaultLocation?.id,
              shelfId:    editing.defaultShelf?.id,
            }}
            onSave={saveProduct}
          />
        )}
      </div>
    </motion.div>
  );
}
