// DANH SÁCH MÓN ĐỒ TẠI NABY COQUETTE (_naby.coquette)
// status: true (Còn hàng), false (Đã pass / Sold out)

const productsData = [
  {
    id: "naby-01",
    name: "Set hồng Jenny Fairy",
    category: "top",
    size: "Freesize",
    condition: "Newtag",
    price: 280000,
    status: true,
    specs: [
      "✧ Freesize",
      "Newtag"
    ],
    image: "assets/products/jenny_fairy_1.png",
    images: [
      "assets/products/jenny_fairy_1.png",
      "assets/products/jenny_fairy_2.png",
      "assets/products/jenny_fairy_3.png"
    ]
  },
  {
    id: "naby-02",
    name: "Bear short Dawn (nâu nhạt)",
    category: "skirt",
    size: "Size M & L",
    condition: "Newtag",
    price: 140000,
    status: true,
    specs: [
      "✧ Size M (eo 68-74, mông <92, dài 24,5)",
      "✧ Size L (eo 74-80, mông <98, dài 24,5)",
      "Newtag"
    ],
    image: "assets/products/bear_short_1.png",
    images: [
      "assets/products/bear_short_1.png"
    ]
  },
  {
    id: "naby-03",
    name: "Rizza white dress Dawn",
    category: "dress",
    size: "Size S",
    condition: "Newtag",
    price: 230000,
    status: true,
    specs: [
      "✧ Size S",
      "Newtag"
    ],
    image: "assets/products/rizza_dress_1.png",
    images: [
      "assets/products/rizza_dress_1.png"
    ]
  },
  {
    id: "naby-04",
    name: "Váy 2 Dây Ren Trắng Vintage",
    category: "dress",
    size: "Size S (dưới 48kg)",
    condition: "Like new 99%",
    price: 185000,
    status: true,
    specs: [
      "✧ Size S (dưới 48kg)",
      "Like new 99%"
    ],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-05",
    name: "Áo Cardigan Len Dệt Kim Kem",
    category: "top",
    size: "Freesize (dưới 55kg)",
    condition: "Độ mới 95%",
    price: 145000,
    status: true,
    specs: [
      "✧ Freesize (dưới 55kg)",
      "Độ mới 95%"
    ],
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-06",
    name: "Chân Váy Xòe Xếp Ly Pastel",
    category: "skirt",
    size: "Size M (eo 64-68cm)",
    condition: "Like new 98%",
    price: 125000,
    status: false,
    specs: [
      "✧ Size M (eo 64-68cm)",
      "Like new 98%"
    ],
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-07",
    name: "Váy Hoa Nhí Cổ Nơ Coquette",
    category: "dress",
    size: "Size S-M",
    condition: "Độ mới 95%",
    price: 195000,
    status: true,
    specs: [
      "✧ Size S-M",
      "Độ mới 95%"
    ],
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-08",
    name: "Áo Kiểu Baby Doll Phối Ren",
    category: "top",
    size: "Freesize",
    condition: "Like new 98%",
    price: 135000,
    status: false,
    specs: [
      "✧ Freesize",
      "Like new 98%"
    ],
    image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-09",
    name: "Chân Váy Chữ A Viền Ren Hoa",
    category: "skirt",
    size: "Size S (eo 62-66cm)",
    condition: "New with tag 100%",
    price: 155000,
    status: true,
    specs: [
      "✧ Size S (eo 62-66cm)",
      "New with tag 100%"
    ],
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-10",
    name: "Đầm Ren Babydoll Tay Bồng",
    category: "dress",
    size: "Freesize (dưới 52kg)",
    condition: "Like new 99%",
    price: 210000,
    status: true,
    specs: [
      "✧ Freesize (dưới 52kg)",
      "Like new 99%"
    ],
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-11",
    name: "Áo Sơ Mi Voan Tơ Cổ Bèo Sen",
    category: "top",
    size: "Size S",
    condition: "Độ mới 96%",
    price: 140000,
    status: false,
    specs: [
      "✧ Size S",
      "Độ mới 96%"
    ],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-12",
    name: "Váy Babydoll Tơ Óng Hoa Trà",
    category: "dress",
    size: "Size S-M (dưới 50kg)",
    condition: "Like new 99%",
    price: 195000,
    status: true,
    specs: [
      "✧ Size S-M (dưới 50kg)",
      "Like new 99%"
    ],
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "naby-13",
    name: "Áo Croptop Cột Nơ Lưng Cổ Vuông",
    category: "top",
    size: "Freesize",
    condition: "Like new 98%",
    price: 125000,
    status: false,
    specs: [
      "✧ Freesize",
      "Like new 98%"
    ],
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=600&q=80"
    ]
  }
];
