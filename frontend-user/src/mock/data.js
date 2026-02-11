// Mock数据

export const categories = [
  { id: 1, name: '数码电器', icon: 'Monitor' },
  { id: 3, name: '美妆护肤', icon: 'MagicStick' },
  { id: 5, name: '家居生活', icon: 'House' },
  { id: 6, name: '母婴用品', icon: 'Cherry' },
  { id: 7, name: '运动户外', icon: 'Football' },
  { id: 8, name: '图书文具', icon: 'Reading' }
]

export const products = [
  {
    id: 1,
    name: '无线蓝牙耳机 降噪长续航',
    description: '主动降噪，40小时超长续航，高清音质，舒适佩戴',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'
    ],
    categoryId: 1,
    stock: 100,
    sales: 2580,
    isHot: true,
    isNew: false,
    specs: [
      { name: '颜色', values: ['星空黑', '云朵白', '薄荷绿'] },
      { name: '版本', values: ['标准版', '降噪版'] }
    ]
  },
  {
    id: 3,
    name: '补水面膜套装 深层滋养',
    description: '玻尿酸精华，深层补水，改善干燥，提亮肤色',
    price: 89,
    originalPrice: 129,
    image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=400&fit=crop'
    ],
    categoryId: 3,
    stock: 200,
    sales: 5620,
    isHot: false,
    isNew: true,
    specs: [
      { name: '规格', values: ['10片装', '20片装'] }
    ]
  },
  {
    id: 5,
    name: '智能台灯 护眼阅读',
    description: 'LED护眼光源，无频闪，多档调光，触控操作',
    price: 129,
    originalPrice: 169,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop'
    ],
    categoryId: 5,
    stock: 150,
    sales: 980,
    isHot: false,
    isNew: true,
    specs: [
      { name: '颜色', values: ['白色', '黑色'] }
    ]
  },
  {
    id: 6,
    name: '婴儿纯棉连体衣',
    description: 'A类纯棉，柔软亲肤，透气舒适，安全无刺激',
    price: 79,
    originalPrice: 99,
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=400&fit=crop'
    ],
    categoryId: 6,
    stock: 120,
    sales: 1560,
    isHot: false,
    isNew: false,
    specs: [
      { name: '颜色', values: ['粉色', '蓝色', '米白'] },
      { name: '尺码', values: ['66', '73', '80', '90'] }
    ]
  }
]

export const banners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', link: '/product/1' },
  { id: 2, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop', link: '/product/1' },
]

export const users = [
  { id: 1, email: 'user@test.com', password: '123456', nickname: '测试用户', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop', phone: '13800138000' },
  { id: 2, email: 'admin@test.com', password: '123456', nickname: '管理员', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', phone: '13900139000' }
]

export const addresses = [
  { id: 1, userId: 1, name: '张三', phone: '13800138000', province: '广东省', city: '深圳市', district: '南山区', detail: '科技园路100号', isDefault: true },
  { id: 2, userId: 1, name: '李四', phone: '13900139000', province: '北京市', city: '北京市', district: '朝阳区', detail: '建国路88号', isDefault: false }
]
